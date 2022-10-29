import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import {
  FundingPsbtFinalize,
  FundingPsbtVerify,
  CloseChannelRequest,
  Invoice,
  QueryRoutesRequest
} from '@lily-technologies/lnrpc';

import {
  enumerate,
  getXPub,
  signtx,
  promptpin,
  sendpin,
  createAddressTable,
  addAddressTag,
  deleteAddressTag,
  getAllLabelsForAddress,
  createTransactionTable,
  addTransactionDescription,
  getTransactionDescription,
  dbConnect
} from '@lily/shared-server';

import {
  getFile,
  saveFile,
  getBitcoinCoreConfig,
  LightningBaseProvider,
  LND,
  OnchainBaseProvider,
  BitcoinCoreProvider,
  EsploraProvider,
  ElectrumProvider
} from '@lily/shared-server';

import {
  NodeConfigWithBlockchainInfo,
  HwiEnumerateResponse,
  HwiXpubRequest,
  CoindeskHistoricPriceResponse,
  CoindeskCurrentPriceResponse,
  LightningConfig,
  OpenChannelRequestArgs,
  OnChainConfig,
  OnchainProviderConnectionDetails
} from '@lily/types';

import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

try {
  require('electron-reloader')(module);
} catch (_) {}

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
});

const PROTOCOL_PREFIX = 'lily';

// disable showErrorBox
dialog.showErrorBox = function (title, content) {
  console.log(`${title}\n${content}`);
};

const isTestnet = !!('TESTNET' in process.env);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

let currentNodeConfig: NodeConfigWithBlockchainInfo;

let OnchainDataProvider: OnchainBaseProvider;
let LightningDataProvider: LightningBaseProvider;

// set userData path so doesn't use scoped name from package.json
app.setPath('userData', path.join(app.getPath('appData'), 'LilyWallet'));

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    backgroundColor: 'rgb(245, 247, 250)',
    transparent: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  mainWindow.setTrafficLightPosition &&
    mainWindow.setTrafficLightPosition({
      x: 10,
      y: 10
    });

  if ('DEVURL' in process.env) {
    // load dev url
    mainWindow.loadURL(`http://localhost:3000/`);
  } else {
    // load production url
    mainWindow.loadURL(`file://${__dirname}/frontend/index.html`);
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show()
  // })

  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault();

      shell.openExternal(url);
      if (frameName === 'modal') {
        // open window as modal
        Object.assign(options, {
          modal: true,
          parent: mainWindow,
          width: 100,
          height: 100
        });
        event.newGuest = new BrowserWindow(options);
      }
    }
  );

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

const setupInitialNodeConfig = async () => {
  try {
    console.log('Retrieving node config file...');
    const userDataPath = app.getPath('userData');
    const nodeConfigFile = await getFile('node-config.json', userDataPath);
    console.log('Retrieved node config file.');
    const nodeConfig: OnchainProviderConnectionDetails = JSON.parse(nodeConfigFile.file);
    try {
      // TODO: should eventually store provider name along with data so correct provider client gets initialized
      // TODO: for now, only Electrum supported
      console.log(`Attempting to connect to ${nodeConfig.url}...`);
      OnchainDataProvider = new ElectrumProvider(
        nodeConfig.url,
        nodeConfig.port,
        nodeConfig.protocol,
        isTestnet
      );
      await OnchainDataProvider.initialize();
      console.log(`Connected to ${nodeConfig.url}.`);
    } catch (e) {
      console.log(`Failed to connect to ${nodeConfig.url}`);
    }
  } catch (e) {
    console.log(`Failed to retrieve node config file.`);
    try {
      console.log('Trying to connect to local Bitcoin Core instance...');
      const nodeConfig = await getBitcoinCoreConfig();
      OnchainDataProvider = new BitcoinCoreProvider(nodeConfig, isTestnet);
      await OnchainDataProvider.initialize();
      if (OnchainDataProvider.connected) {
        console.log('Connected to local Bitcoin Core instance.');
      } else {
        throw new Error(); // throw error to go to catch segment
      }
    } catch (e) {
      console.log('Failed to connect to local Bitcoin Core instance.');
      const defaultElectrumEndpoint = 'electrum.emzy.de';
      try {
        console.log(`Connecting to ${defaultElectrumEndpoint}...`);
        OnchainDataProvider = new ElectrumProvider(
          defaultElectrumEndpoint,
          50002,
          'tcp',
          isTestnet
        );
        await OnchainDataProvider.initialize();
        console.log(`Connected to ${defaultElectrumEndpoint}`);
      } catch (e) {
        console.log(`Failed to connect to ${defaultElectrumEndpoint}`);
        const defaultEsploraEndpoint = 'https://blockstream.info';
        try {
          console.log(`Connecting to ${defaultEsploraEndpoint}...`);
          OnchainDataProvider = new EsploraProvider(defaultEsploraEndpoint, isTestnet);
          OnchainDataProvider.initialize();
          console.log(`Connected to ${defaultEsploraEndpoint}`);
        } catch (e) {
          console.log(`Failed to connect to ${defaultEsploraEndpoint}`);
        }
      }
    }
  }
};

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL_PREFIX, process.execPath, [
      path.resolve(process.argv[1])
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);
}

// Protocol handler for osx
app.on('open-url', function (event, url) {
  event.preventDefault();
  const parsedUrl = url.substring(
    url.indexOf(PROTOCOL_PREFIX) + PROTOCOL_PREFIX.length + '://'.length
  );
  if ('DEVURL' in process.env) {
    mainWindow.loadURL(`http://localhost:3000#/${parsedUrl}`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/frontend/index.html#/${parsedUrl}`);
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('ready', setupInitialNodeConfig);

app.on('ready', async () => {
  const userDataPath = app.getPath('userData');
  const db = await dbConnect(userDataPath);
  createAddressTable(db);
});

app.on('ready', async () => {
  const userDataPath = app.getPath('userData');
  const db = await dbConnect(userDataPath);
  createTransactionTable(db);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('/account-data', async (event, config: OnChainConfig) => {
  // load data from cache
  // event.reply("/account-data", accountData);

  try {
    const userDataPath = app.getPath('userData');
    const db = await dbConnect(userDataPath);
    const accountData = await OnchainDataProvider.getAccountData(config, db);
    event.reply('/account-data', accountData);
  } catch (e) {
    console.log(`(${config.id}) /account-data error: `, e);
  }
});

ipcMain.on('/lightning-account-data', async (event, config: LightningConfig) => {
  console.log(`Connecting to ${config.name}...`);
  try {
    // if connecting to .onion, add grpc_proxy env variable
    if (config.connectionDetails.lndConnectUri.includes('.onion')) {
      // TODO: package tor with the app and do initialization, write to torrc, etc for the user similar to https://github.com/LN-Zap/node-lnd-grpc/blob/master/src/utils/tor.js#L30
      process.env.grpc_proxy = `http://127.0.0.1:9065`;
    }
    LightningDataProvider = new LND(config.connectionDetails.lndConnectUri);
    LightningDataProvider.getAccountData(config, (accountData) => {
      event.reply('/lightning-account-data', accountData);
    });
  } catch (e) {
    console.log(`(${config.id}) /lightning-account-data: `, e);
  }
});

ipcMain.on('/open-channel', async (event, args: OpenChannelRequestArgs) => {
  const { lightningAddress, channelAmount } = args;
  try {
    LightningDataProvider.openChannelInitialize(
      { lightningAddress, channelAmount },
      (err, data) => {
        if (err) {
          event.reply('/open-channel', err);
        } else {
          event.reply('/open-channel', null, data);
        }
      }
    );
  } catch (e) {
    console.log('error opening channel: ', e);
    return Promise.reject(e);
  }
});

ipcMain.handle('/open-channel-verify', async (event, args: FundingPsbtVerify) => {
  const { fundedPsbt, pendingChanId } = args; // unsigned psbt

  try {
    await LightningDataProvider.openChannelVerify({
      fundedPsbt,
      pendingChanId,
      skipFinalize: false
    });
    return Promise.resolve();
  } catch (e) {
    console.log('/open-channel-verify error: ', e);
    return Promise.reject(e);
  }
});

ipcMain.handle('/open-channel-finalize', async (event, args: FundingPsbtFinalize) => {
  const { signedPsbt, pendingChanId } = args; // signed psbt
  try {
    await LightningDataProvider.openChannelFinalize({
      signedPsbt,
      pendingChanId
    });
    return Promise.resolve();
  } catch (e) {
    console.log('/open-channel-finalize error: ', e);
    return Promise.reject(e);
  }
});

ipcMain.on('/close-channel', async (event, args: CloseChannelRequest) => {
  try {
    LightningDataProvider.closeChannel(args, (data) => {
      event.reply('/close-channel', data);
    });
  } catch (e) {
    console.log('/close-channel error: ', e);
    event.reply('/close-channel', {
      error: {
        message: e
      }
    });
  }
});

ipcMain.on(
  '/lightning-send-payment',
  async (event, args: { config: LightningConfig; paymentRequest: string }) => {
    const { config, paymentRequest } = args;

    console.log(`(${config.id}): Sending payment...`);
    try {
      LightningDataProvider.sendPayment(paymentRequest, (data) => {
        event.reply('/lightning-send-payment', data);
      });
    } catch (e) {
      console.log('/lightning-send-payment e: ', e);
    }
  }
);

ipcMain.handle('/lightning-connect', async (event, args: { lndConnectUri: string }) => {
  const { lndConnectUri } = args;
  try {
    LightningDataProvider = new LND(lndConnectUri);
    const info = await LightningDataProvider.initialize();
    return Promise.resolve(info);
  } catch (e) {
    console.log('/lightning-connect e: ', e);
    return Promise.reject('fail');
  }
});

ipcMain.handle('/generate-invoice', async (event, args: Invoice) => {
  const { memo, value } = args;
  try {
    const invoice = await LightningDataProvider.generateInvoice({ memo, value });
    return Promise.resolve(invoice);
  } catch (e) {
    console.log('/generate-invoice e: ', e);
    return Promise.reject(e);
  }
});

ipcMain.handle('/get-invoice', async (event, args: { paymentHash: string }) => {
  const { paymentHash } = args;
  try {
    const invoice = await LightningDataProvider.getInvoice({ paymentHash });
    return Promise.resolve(invoice);
  } catch (e) {
    console.log('/get-invoice e: ', e);
    return Promise.reject(e);
  }
});

ipcMain.handle('/get-routes', async (event, args: QueryRoutesRequest) => {
  const { pubKey, amt } = args;
  try {
    const invoice = await LightningDataProvider.getRoutes({ pubKey, amt });
    return Promise.resolve(invoice);
  } catch (e) {
    console.log('/get-invoice e: ', e);
    return Promise.reject(e);
  }
});

ipcMain.handle('/quit', () => {
  app.quit();
});

ipcMain.handle('/get-config', async (event, args) => {
  try {
    const userDataPath = app.getPath('userData');
    const file = await getFile('lily-config-encrypted.txt', userDataPath);
    return file;
  } catch (e) {
    console.log('Failed to get Lily config', e);
  }
});

ipcMain.handle('/save-config', async (event, args: { encryptedConfigFile: string }) => {
  const { encryptedConfigFile } = args;
  const userDataPath = app.getPath('userData');
  return saveFile(encryptedConfigFile, 'lily-config-encrypted.txt', userDataPath);
});

ipcMain.handle('/download-item', async (event, args) => {
  const { data, filename } = args;
  try {
    const win = BrowserWindow.getFocusedWindow();

    const { canceled, filePath } = await dialog.showSaveDialog(win!, {
      defaultPath: filename
    });

    if (canceled) {
      throw new Error('File not saved.');
    }

    if (filePath) {
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          return Promise.reject(false);
        } else {
          return Promise.resolve(true);
        }
      });
    }
  } catch (e) {
    return Promise.reject(false);
  }
});

ipcMain.handle('/bitcoin-network', async () => {
  return Promise.resolve(isTestnet);
});

ipcMain.handle('/current-btc-price', async () => {
  const { data }: { data: CoindeskCurrentPriceResponse } = await axios.get(
    'https://api.coindesk.com/v1/bpi/currentprice.json'
  );
  const currentPriceWithCommasStrippedOut = data.bpi.USD.rate.replace(',', '');
  return Promise.resolve(currentPriceWithCommasStrippedOut);
});

ipcMain.handle('/historical-btc-price', async () => {
  const { data }: { data: CoindeskHistoricPriceResponse } = await axios.get(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-01-01&end=${moment().format(
      'YYYY-MM-DD'
    )}`
  );
  const historicalBitcoinPrice = data.bpi;
  let priceForChart: { price: number; date: string }[] = [];
  for (let i = 0; i < Object.keys(historicalBitcoinPrice).length; i++) {
    priceForChart.push({
      price: Object.values(historicalBitcoinPrice)[i],
      date: Object.keys(historicalBitcoinPrice)[i]
    });
  }
  return Promise.resolve(priceForChart);
});

ipcMain.handle('/enumerate', async () => {
  try {
    const resp = JSON.parse(await enumerate());
    if (resp.error) {
      return Promise.reject(new Error('Error enumerating hardware wallets'));
    }
    const filteredDevices = (resp as HwiEnumerateResponse[]).filter((device) => {
      return (
        device.type === 'coldcard' ||
        device.type === 'ledger' ||
        device.type === 'trezor' ||
        device.type === 'bitbox02'
      );
    });
    return Promise.resolve(filteredDevices);
  } catch (e) {
    console.log('/enumerate error: ', e);
  }
});

ipcMain.handle('/xpub', async (event, args: HwiXpubRequest) => {
  const { deviceType, devicePath, path } = args;
  const resp = JSON.parse(await getXPub(deviceType, devicePath, path, isTestnet)); // responses come back as strings, need to be parsed
  if (resp.error) {
    return Promise.reject(new Error('Error extracting xpub'));
  }
  return Promise.resolve(resp);
});

ipcMain.handle('/sign', async (event, args) => {
  const { deviceType, devicePath, psbt } = args;
  const resp = JSON.parse(await signtx(deviceType, devicePath, psbt, isTestnet));
  if (resp.error) {
    return Promise.reject(new Error('Error signing transaction'));
  }
  return Promise.resolve(resp);
});

ipcMain.handle('/promptpin', async (event, args) => {
  const { deviceType, devicePath } = args;
  const resp = JSON.parse(await promptpin(deviceType, devicePath));
  if (resp.error) {
    console.log(resp);
    return Promise.reject(new Error('Error prompting pin'));
  }
  return Promise.resolve(resp);
});

ipcMain.handle('/sendpin', async (event, args) => {
  const { deviceType, devicePath, pin } = args;
  const resp = JSON.parse(await sendpin(deviceType, devicePath, pin));
  if (resp.error) {
    return Promise.reject(new Error('Error sending pin'));
  }
  return Promise.resolve(resp);
});

ipcMain.handle('/estimate-fee', async (event, args) => {
  try {
    const feeRates = await OnchainDataProvider.estimateFee();
    return Promise.resolve(feeRates);
  } catch (e) {
    console.log(`error /estimate-fee ${e}`);
    return Promise.reject(new Error('Error retrieving fee'));
  }
});

ipcMain.handle('/broadcastTx', async (event, args) => {
  const { txHex } = args;
  try {
    const txId = await OnchainDataProvider.broadcastTransaction(txHex);
    return Promise.resolve(txId);
  } catch (e) {
    console.log(`error /broadcastTx ${e}`);
    return Promise.reject(new Error('Error broadcasting transaction'));
  }
});

ipcMain.handle('/changeNodeConfig', async (event, args) => {
  // TODO: this is overcomplicated. should use some sort of map to get provider to instantiate and then pass in nodeConfig
  const { nodeConfig } = args;
  console.log(`Attempting to connect to ${nodeConfig.provider}...`);
  if (nodeConfig.provider === 'Bitcoin Core') {
    const nodeConfig = await getBitcoinCoreConfig();
    OnchainDataProvider = new BitcoinCoreProvider(nodeConfig, isTestnet);
    await OnchainDataProvider.initialize();
  } else if (nodeConfig.provider === 'Electrum') {
    OnchainDataProvider = new ElectrumProvider(
      nodeConfig.baseURL,
      Number(nodeConfig.port),
      nodeConfig.ssl ? 'ssl' : 'tcp',
      isTestnet
    );
    await OnchainDataProvider.initialize();
  } else {
    OnchainDataProvider = new EsploraProvider('https://blockstream.info', isTestnet);
    await OnchainDataProvider.initialize();
  }
  const config = OnchainDataProvider.getConfig();
  const userDataPath = app.getPath('userData');
  await saveFile(JSON.stringify(config.connectionDetails), 'node-config.json', userDataPath);
  console.log(`Connected to ${nodeConfig.provider}...`);
  return Promise.resolve(config);
});

ipcMain.handle('/get-node-config', async (event, args) => {
  const nodeConfig = await OnchainDataProvider.getConfig();
  return Promise.resolve(nodeConfig);
});

ipcMain.handle('/does-address-have-transaction', async (event, args) => {
  const { address } = args;
  const txs = await OnchainDataProvider.getTransactionsFromAddress(address);
  return Promise.resolve(txs.length > 0);
});

// ipcMain.handle('/rescanBlockchain', async (event, args) => {
//   const { currentAccount, startHeight } = args;
//   try {
//     if (currentNodeConfig.provider !== 'Blockstream') {
//       const currentConfig = { ...currentNodeConfig };
//       currentConfig.baseURL = `${currentNodeConfig.baseURL}/wallet/lily${currentAccount.config.id}`;
//       const nodeClient = getClientFromNodeConfig(currentConfig);

//       // don't await this call because it always times out, just trust that it's happening
//       // and then we verify via response from getwalletinfo
//       nodeClient.rescanBlockchain(parseInt(startHeight));

//       sleep(100);
//       const walletInfo = await nodeClient.getWalletInfo();
//       if (walletInfo.scanning) {
//         return Promise.resolve({ success: true });
//       } else {
//         throw new Error(`Wallet isnt scanning ${currentAccount.config.id}`);
//       }
//     }
//   } catch (e) {
//     console.log(`error /rescanBlockchain ${e}`);
//     return Promise.reject({ success: false, error: e });
//   }
// });

// ipcMain.handle('/getWalletInfo', async (event, args) => {
//   const { currentAccount } = args;
//   try {
//     const currentConfig = { ...currentNodeConfig };
//     currentConfig.baseURL = `${currentNodeConfig.baseURL}/wallet/lily${currentAccount.config.id}`;
//     const nodeClient = getClientFromNodeConfig(currentConfig);
//     const walletInfo = await nodeClient.getWalletInfo();
//     return Promise.resolve({ ...walletInfo });
//   } catch (e) {
//     console.log(`error /getWalletInfo ${e}`);
//     return Promise.reject({ success: false, error: e });
//   }
// });

ipcMain.handle('/isConfirmedTransaction', async (event, args) => {
  const { txId } = args;
  if (txId.length === 64) {
    try {
      const isConfirmed = await OnchainDataProvider.isConfirmedTransaction(txId);
      return Promise.resolve(isConfirmed);
    } catch (e) {
      console.log(`error /isConfirmedTransaction ${e}`);
      return Promise.reject({ success: false, error: e });
    }
  }
  console.log(`error /isConfirmedTransaction: Invalid txId`);
  return Promise.reject({ success: false });
});

ipcMain.handle('/add-address-label', async (event, args) => {
  const { address, label } = args;
  try {
    const userDataPath = app.getPath('userData');
    const db = await dbConnect(userDataPath);
    const response = await addAddressTag(db, address, label);
    return Promise.resolve(response);
  } catch (e) {
    console.log(`error /add-address-label ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

ipcMain.handle('/delete-address-label', async (event, args) => {
  const { id } = args;
  try {
    const userDataPath = app.getPath('userData');
    const db = await dbConnect(userDataPath);
    await deleteAddressTag(db, id);
    return Promise.resolve();
  } catch (e) {
    console.log(`error /delete-address-label ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

ipcMain.handle('/get-address-labels', async (event, args) => {
  const { address } = args;
  try {
    const userDataPath = app.getPath('userData');
    const db = await dbConnect(userDataPath);
    const labels = await getAllLabelsForAddress(db, address);
    return Promise.resolve(labels);
  } catch (e) {
    console.log(`error /get-address-labels ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

ipcMain.handle('/add-transaction-description', async (event, args) => {
  const { txid, description } = args;
  console.log(`Adding description ${description} to tx ${txid}`);
  try {
    const userDataPath = app.getPath('userData');
    const db = await dbConnect(userDataPath);
    const response = await addTransactionDescription(db, txid, description);
    return Promise.resolve(response);
  } catch (e) {
    console.log(`error /add-transaction-description ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});
ipcMain.handle('/get-transaction-description', async (event, args) => {
  const { txid } = args;
  try {
    const userDataPath = app.getPath('userData');
    const db = await dbConnect(userDataPath);
    const description = await getTransactionDescription(db, txid);
    return Promise.resolve(description);
  } catch (e) {
    console.log(`error /get-transaction-description ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

// Log both at dev console and at running node console instance
function logEverywhere(s: string) {
  console.log(s);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`);
  }
}
