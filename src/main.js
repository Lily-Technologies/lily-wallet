const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');
const { download } = require('electron-dl');

const { enumerate, getXPub, signtx } = require('./server/commands');
console.log('enumerate, getXPub, signtx: ', enumerate, getXPub, signtx);

const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/assets/icon.png',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  // mainWindow.loadURL('http://localhost:3001');
  // mainWindow.loadURL(`file://${__dirname}/build/index.html`);
  mainWindow.loadURL(`http://localhost:3001/`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

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
  console.log(await download(win, url, { filename }), filename);
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('/enumerate', async (event, args) => {
  log.info('hits main enumerate: ', event, args);
  const devices = await enumerate();
  log.info('xxdevices: ', devices)
  return JSON.parse(devices);
});

ipcMain.handle('/xpub', async (event, args) => {
  const { deviceType, devicePath, path } = args;
  const xpub = await getXPub(deviceType, devicePath, path)
  return JSON.parse(xpub);
});

ipcMain.handle('/sign', async (event, args) => {
  const { deviceType, devicePath, psbt } = args;
  const signedPsbt = await signtx(deviceType, devicePath, psbt);
  return JSON.parse(signedPsbt);
});