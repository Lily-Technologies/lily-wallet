import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { FundingPsbtFinalize, FundingPsbtVerify, CloseChannelRequest, Invoice } from '@radar/lnrpc';

import { enumerate, getXPub, signtx, promptpin, sendpin } from '@lily/shared-server';

import { getFile, saveFile, getBitcoinCoreConfig } from '@lily/shared-server';

import {
  OnchainBaseProvider,
  BitcoinCoreProvider,
  BlockstreamProvider,
  ElectrumProvider
} from '@lily/shared-server';

import { LightningBaseProvider, LND } from '@lily/shared-server';

import {
  NodeConfigWithBlockchainInfo,
  HwiResponseEnumerate,
  CoindeskHistoricPriceResponse,
  CoindeskCurrentPriceResponse,
  LightningConfig,
  OpenChannelRequestArgs,
  OnChainConfig
} from '@lily/types';

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

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    backgroundColor: 'rgb(245, 247, 250)',
    transparent: true,
    frame: false,
    // icon: path.join(__dirname, '/assets/AppIcon.icns'),
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
    mainWindow.loadURL(`http://localhost:3001/`);
  } else {
    // load production url
    mainWindow.loadURL(`file://${__dirname}/../../frontend/build/index.html`);
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
    console.log('Trying to connect to local Bitcoin Core instance...');
    const nodeConfig = await getBitcoinCoreConfig();
    OnchainDataProvider = new BitcoinCoreProvider(nodeConfig, isTestnet);
    await OnchainDataProvider.initialize();
    if (OnchainDataProvider.connected) {
      console.log('Connected to local Bitcoin Core instance.');
    } else {
      console.log('Failed to connect to local Bitcoin Core instance.');
      throw new Error(); // throw error to go to catch segment
    }
  } catch (e) {
    try {
      console.log('Trying to connect to remote Bitcoin Core instance...');
      const nodeConfigFile = await getFile('node-config.json');
      const nodeConfig = JSON.parse(nodeConfigFile.file);
      try {
        OnchainDataProvider = new BitcoinCoreProvider(nodeConfig, isTestnet);
        await OnchainDataProvider.initialize();
        if (OnchainDataProvider.connected) {
          console.log('Connected to remote Bitcoin Core instance');
        } else {
          console.log('Failed to connect to remote Bitcoin Core instance');
        }
      } catch (e) {
        console.log('Failed to connect to remote Bitcoin Core instance');
      }
    } catch (e) {
      console.log('Failed to retrieve remote Bitcoin Core connection data.');
      try {
        console.log('Connecting to Electrum...');
        OnchainDataProvider = new ElectrumProvider(isTestnet);
        OnchainDataProvider.initialize();
        console.log('Connected to Electrum');
      } catch (e) {
        console.log('Failed to connect to Electrum');

        try {
          console.log('Connecting to Blockstream...');
          OnchainDataProvider = new BlockstreamProvider(isTestnet);
          OnchainDataProvider.initialize();
          console.log('Connected to Blockstream');
        } catch (e) {
          console.log('Failed to connect to Blockstream');
        }
      }
    }
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('ready', setupInitialNodeConfig);

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
    const accountData = await OnchainDataProvider.getAccountData(config);
    event.reply('/account-data', accountData);
  } catch (e) {
    console.log(`(${config.id}) /account-data error: `, e);
  }
});

ipcMain.on('/lightning-account-data', async (event, config: LightningConfig) => {
  console.log(`Connecting to ${config.name}...`);
  try {
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
    LightningDataProvider.openChannelInitialize({ lightningAddress, channelAmount }, (data) => {
      event.reply('/open-channel', data);
    });
  } catch (e) {
    console.log('error opening channel: ', e);
    event.reply('/open-channel', {
      error: {
        message: e
      }
    });
  }
});

ipcMain.on('/open-channel-verify', async (event, args: FundingPsbtVerify) => {
  const { fundedPsbt, pendingChanId } = args; // unsigned psbt

  try {
    await LightningDataProvider.openChannelVerify({ fundedPsbt, pendingChanId });
  } catch (e) {
    console.log('/open-channel-verify error: ', e);
  }
});

ipcMain.on('/open-channel-finalize', async (event, args: FundingPsbtFinalize) => {
  const { signedPsbt, pendingChanId } = args; // signed psbt
  try {
    await LightningDataProvider.openChannelFinalize({
      signedPsbt,
      pendingChanId
    });
  } catch (e) {
    console.log('/open-channel-finalize error: ', e);
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

ipcMain.on('/lightning-send-payment', async (event, args) => {
  const { config, paymentRequest } = args;

  console.log(`(${config.id}): Sending payment...`);
  try {
    LightningDataProvider.sendPayment(paymentRequest, (data) => {
      event.reply('/lightning-send-payment', data);
    });
  } catch (e) {
    console.log('/lightning-send-payment e: ', e);
  }
});

ipcMain.handle('/lightning-connect', async (event, args) => {
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

ipcMain.handle('/lightning-invoice', async (event, args: Invoice) => {
  const { memo, value } = args;
  try {
    const invoice = await LightningDataProvider.getInvoice({ memo, value });
    return Promise.resolve(invoice);
  } catch (e) {
    console.log('/lightning-invoice e: ', e);
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
    console.log('Failed to get Lily config');
  }
});

ipcMain.handle('/save-config', async (event, args) => {
  const { encryptedConfigFile } = args;
  const userDataPath = app.getPath('userData');
  return saveFile(encryptedConfigFile, 'lily-config-encrypted.txt', userDataPath);
});

ipcMain.handle('/download-item', async (event, { data, filename }) => {
  try {
    const win = BrowserWindow.getFocusedWindow();

    const { canceled, filePath } = await dialog.showSaveDialog(win!, {
      defaultPath: filename
    });

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

ipcMain.handle('/bitcoin-network', async (event, args) => {
  return Promise.resolve(isTestnet);
});

ipcMain.handle('/current-btc-price', async (event, args) => {
  const { data }: { data: CoindeskCurrentPriceResponse } = await axios.get(
    'https://api.coindesk.com/v1/bpi/currentprice.json'
  );
  const currentPriceWithCommasStrippedOut = data.bpi.USD.rate.replace(',', '');
  return Promise.resolve(currentPriceWithCommasStrippedOut);
});

ipcMain.handle('/historical-btc-price', async (event, args) => {
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

ipcMain.handle('/enumerate', async (event, args) => {
  try {
    const resp = JSON.parse(await enumerate());
    if (resp.error) {
      return Promise.reject(new Error('Error enumerating hardware wallets'));
    }
    const filteredDevices = (resp as HwiResponseEnumerate[]).filter((device) => {
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

ipcMain.handle('/xpub', async (event, args) => {
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
  const { nodeConfig } = args;
  console.log(`Attempting to connect to ${nodeConfig.provider}...`);
  if (nodeConfig.provider === 'Bitcoin Core') {
    const nodeConfig = await getBitcoinCoreConfig();
    OnchainDataProvider = new BitcoinCoreProvider(nodeConfig, isTestnet);
    await OnchainDataProvider.initialize();
  } else if (nodeConfig.provider === 'Custom Node') {
    OnchainDataProvider = new BitcoinCoreProvider(nodeConfig, isTestnet);
    await OnchainDataProvider.initialize();
  } else if (nodeConfig.provider === 'Electrum') {
    OnchainDataProvider = new ElectrumProvider(isTestnet);
    await OnchainDataProvider.initialize();
  } else {
    OnchainDataProvider = new BlockstreamProvider(isTestnet);
    await OnchainDataProvider.initialize();
  }
  const config = OnchainDataProvider.getConfig();
  return Promise.resolve(config);
});

ipcMain.handle('/get-node-config', async (event, args) => {
  const nodeConfig = await OnchainDataProvider.getConfig();
  return Promise.resolve(nodeConfig);
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