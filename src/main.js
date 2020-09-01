const axios = require('axios');
const moment = require('moment');
const { app, BrowserWindow, ipcMain } = require('electron');
const { networks } = require('bitcoinjs-lib');
const BigNumber = require('bignumber.js');
const { download } = require('electron-dl');
const Client = require('bitcoin-core');
const { bitcoinsToSatoshis } = require("unchained-bitcoin");

const { enumerate, getXPub, signtx, promptpin, sendpin } = require('./server/commands');
const { getDataFromMultisig, getDataFromXPub, getMultisigDescriptor } = require('./utils/transactions');

const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: 'rgb(245, 247, 250)',
    // icon: path.join(__dirname, '/assets/AppIcon.icns'),
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  mainWindow.maximize();

  // load production url
  // mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
  // load dev url
  mainWindow.loadURL(`http://localhost:3001/`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show()
  // })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


ipcMain.on('download-item', async (event, { url, filename }) => {
  const win = BrowserWindow.getFocusedWindow();
  await download(win, url, { filename });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

ipcMain.on('/account-data', async (event, args) => {
  const { config, nodeConfig } = args;
  const currentBitcoinNetwork = networks.bitcoin;
  let addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos;
  let nodeClient = undefined;
  if (nodeConfig) {
    const nodeClient = new Client({
      // wallet: config.name,
      username: nodeConfig.username,
      password: nodeConfig.password,
      version: '0.20.0'
    });

    const walletList = await nodeClient.listWallets();
    console.log('walletList: ', walletList);

    if (!walletList.includes(config.name)) {
      try {
        const walletResp = await nodeClient.loadWallet({ filename: config.name });
        console.log('walletResp: ', walletResp);
      } catch (e) { // if failed to load wallet, then probably doesnt exist so let's create one and import
        console.log('hits catch: ', e);
        await nodeClient.createWallet({ wallet_name: config.name });
        console.log('after createWallet: ', config)
        if (config.quorum.totalSigners === 1) {
          for (let i = 0; i < 1000; i++) {
            const receiveAddress = getAddressFromAccount(config, `m/0/${i}`, currentBitcoinNetwork)
            const changeAddress = getAddressFromAccount(config, `m/1/${i}`, currentBitcoinNetwork)

            await client.importAddress({
              address: receiveAddress,
              rescan: false
            });

            await client.importAddress({
              address: changeAddress,
              rescan: i === 999 ? true : false
            });

          }

        } else { // multisig
          //  import receive addresses
          await client.importMulti({
            desc: getMultisigDescriptor(nodeClient, config.quorum.requiredSigners, config.extendedPublicKeys, true),
            range: [0, 1000]
          });

          // import change
          await client.importMulti({
            desc: getMultisigDescriptor(nodeClient, config.quorum.requiredSigners, config.extendedPublicKeys, false),
            range: [0, 1000]
          });
        }
      }
    }
  }

  if (config.quorum.totalSigners > 1) {
    [addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getDataFromMultisig(config, nodeClient, currentBitcoinNetwork);
  } else {
    [addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getDataFromXPub(config, nodeClient, currentBitcoinNetwork);
  }

  const currentBalance = availableUtxos.reduce((accum, utxo) => accum.plus(utxo.value), BigNumber(0));

  const accountData = {
    name: config.name,
    config: config,
    addresses,
    changeAddresses,
    availableUtxos,
    transactions,
    unusedAddresses,
    currentBalance: currentBalance.toNumber(),
    unusedChangeAddresses
  };

  event.reply('/account-data', accountData);
});

ipcMain.handle('/historical-btc-price', async (event, args) => {
  let historicalBitcoinPrice = await (await axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-01-01&end=${moment().format('YYYY-MM-DD')}`)).data;
  historicalBitcoinPrice = historicalBitcoinPrice.bpi;
  let priceForChart = [];
  for (let i = 0; i < Object.keys(historicalBitcoinPrice).length; i++) {
    priceForChart.push({
      price: Object.values(historicalBitcoinPrice)[i],
      date: Object.keys(historicalBitcoinPrice)[i]
    })
  }
  return Promise.resolve(priceForChart);
});

ipcMain.handle('/enumerate', async (event, args) => {
  const resp = JSON.parse(await enumerate());
  if (resp.error) {
    return Promise.reject(new Error('Error enumerating hardware wallets'))
  }
  const filteredDevices = resp.filter((device) => {
    return device.type === 'coldcard' || device.type === 'ledger' || device.type === 'trezor';
  })
  return Promise.resolve(filteredDevices);
});

ipcMain.handle('/xpub', async (event, args) => {
  const { deviceType, devicePath, path } = args;
  const resp = JSON.parse(await getXPub(deviceType, devicePath, path)); // responses come back as strings, need to be parsed
  if (resp.error) {
    return Promise.reject(new Error('Error extracting xpub'));
  }
  return Promise.resolve(resp);
});

ipcMain.handle('/sign', async (event, args) => {
  const { deviceType, devicePath, psbt } = args;
  const resp = JSON.parse(await signtx(deviceType, devicePath, psbt));
  if (resp.error) {
    return Promise.reject(new Error('Error signing transaction'));
  }
  return Promise.resolve(resp);
});

ipcMain.handle('/promptpin', async (event, args) => {
  const { deviceType, devicePath } = args;
  const resp = JSON.parse(await promptpin(deviceType, devicePath));
  if (resp.error) {
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

ipcMain.handle('/estimateFee', async (event, args) => {
  const { nodeConfig, targetBlocks } = args;

  const nodeClient = new Client(nodeConfig);

  try {
    const { feerate } = await nodeClient.estimateSmartFee(targetBlocks);
    const feeAdjusted = BigNumber(feerate).multipliedBy(100000).integerValue(BigNumber.ROUND_CEIL).toNumber(); // TODO: this probably needs relooked at
    return Promise.resolve(feeAdjusted);
  } catch (e) {
    return Promise.reject(new Error('Error retrieving fee'));
  }
});

ipcMain.handle('/broadcastTx', async (event, args) => {
  const { nodeConfig, txHex } = args;
  try {
    const nodeClient = new Client(nodeConfig);
    const resp = await nodeClient.sendRawTransaction(txHex);
    console.log('resp: ', resp);
    return Promise.resolve(resp);
  } catch (e) {
    return Promise.reject(new Error('Error broadcasting transaction'));
  }
});

ipcMain.handle('/check-node-connection', async (event, args) => {
  const { nodeConfig } = args;
  console.log('nodeConfig: ', nodeConfig);
  try {
    const nodeClient = new Client(nodeConfig);
    console.log('nodeClient: ', nodeClient);
    const resp = await nodeClient.upTime();
    console.log('resp: ', resp);
    return Promise.resolve(resp);
  } catch (e) {
    return Promise.reject(new Error('Error connecting to node'));
  }
});