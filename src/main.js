const axios = require('axios');
const moment = require('moment');
const { app, BrowserWindow, ipcMain } = require('electron');
const { networks } = require('bitcoinjs-lib');
const BigNumber = require('bignumber.js');
const { download } = require('electron-dl');

const { enumerate, getXPub, signtx, promptpin, sendpin } = require('./server/commands');
const { getDataFromMultisig, getDataFromXPub } = require('./utils/transactions');

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
  mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
  // load dev url
  // mainWindow.loadURL(`http://localhost:3001/`);

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
  const { config } = args;
  const currentBitcoinNetwork = networks.bitcoin;
  let addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos;

  if (config.quorum.totalSigners > 1) {
    [addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getDataFromMultisig(config, currentBitcoinNetwork);
  } else {
    [addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getDataFromXPub(config, currentBitcoinNetwork);
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