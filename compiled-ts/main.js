"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var axios = require('axios');
var moment = require('moment');
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain, remote = _a.remote, dialog = _a.dialog;
var networks = require('bitcoinjs-lib').networks;
var BigNumber = require('bignumber.js');
var download = require('electron-dl').download;
var Client = require('bitcoin-core');
var _b = require('./server/commands'), enumerate = _b.enumerate, getXPub = _b.getXPub, signtx = _b.signtx, promptpin = _b.promptpin, sendpin = _b.sendpin;
var getRpcInfo = require('./server/utils').getRpcInfo;
var _c = require('./utils/accountMap.js'), getDataFromMultisig = _c.getDataFromMultisig, getDataFromXPub = _c.getDataFromXPub, getMultisigDescriptor = _c.getMultisigDescriptor, getAddressFromAccount = _c.getAddressFromAccount;
var path = require('path');
var fs = require('fs');
var currentBitcoinNetwork = 'TESTNET' in process.env ? networks.testnet : networks.bitcoin;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
var currentNodeConfig = undefined;
var saveFile = function (file, filename) { return __awaiter(void 0, void 0, void 0, function () {
    var userDataPath, filePath;
    return __generator(this, function (_a) {
        userDataPath = (app || remote.app).getPath('userData');
        filePath = path.join(userDataPath, filename);
        fs.writeFile(filePath, file, function (err) {
            if (err) {
                return Promise.reject();
            }
            var fileContents = fs.readFileSync(filePath);
            if (fileContents) {
                var stats = fs.statSync(filePath);
                var mtime = stats.mtime;
                return Promise.resolve({ file: fileContents.toString(), modifiedTime: mtime });
            }
            else {
                return Promise.reject();
            }
        });
        return [2 /*return*/];
    });
}); };
var getFile = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var userDataPath, filePath, fileContents, stats, mtime;
    return __generator(this, function (_a) {
        userDataPath = (app || remote.app).getPath('userData');
        filePath = path.join(userDataPath, filename);
        fileContents = fs.readFileSync(filePath);
        if (fileContents) {
            stats = fs.statSync(filePath);
            mtime = stats.mtime;
            return [2 /*return*/, Promise.resolve({ file: fileContents.toString(), modifiedTime: mtime })];
        }
        else {
            return [2 /*return*/, Promise.reject()];
        }
        return [2 /*return*/];
    });
}); };
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: 'rgb(245, 247, 250)',
        transparent: true,
        frame: false,
        // icon: path.join(__dirname, '/assets/AppIcon.icns'),
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false,
            preload: path.resolve(__dirname, 'preload.js')
        }
    });
    mainWindow.setTrafficLightPosition && mainWindow.setTrafficLightPosition({
        x: 10,
        y: 20
    });
    mainWindow.maximize();
    if ('DEVURL' in process.env) {
        // load dev url
        mainWindow.loadURL("http://localhost:3001/");
    }
    else {
        // load production url
        mainWindow.loadURL("file://" + __dirname + "/../build/index.html");
    }
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
        mainWindow = null;
    });
}
var setupInitialNodeConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nodeConfig, nodeClient, blockchainInfo, e_1, nodeConfigFile, nodeConfig, nodeClient, blockchainInfo, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 9]);
                return [4 /*yield*/, getBitcoinCoreConfig()];
            case 1:
                nodeConfig = _a.sent();
                nodeClient = new Client(nodeConfig);
                return [4 /*yield*/, nodeClient.getBlockchainInfo()];
            case 2:
                blockchainInfo = _a.sent();
                currentNodeConfig = nodeConfig;
                return [3 /*break*/, 9];
            case 3:
                e_1 = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 7, , 8]);
                return [4 /*yield*/, getFile('node-config.json')];
            case 5:
                nodeConfigFile = _a.sent();
                nodeConfig = JSON.parse(nodeConfigFile.file);
                nodeClient = new Client(nodeConfig);
                return [4 /*yield*/, nodeClient.getBlockchainInfo()];
            case 6:
                blockchainInfo = _a.sent();
                currentNodeConfig = nodeConfig;
                return [3 /*break*/, 8];
            case 7:
                e_2 = _a.sent();
                currentNodeConfig = {
                    provider: 'Blockstream'
                };
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/, Promise.reject('setupInitialNodeConfig: Error connecting to Bitcoin Core, using Blockstream')];
            case 9: return [2 /*return*/];
        }
    });
}); };
function getBitcoinCoreConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var rpcInfo, nodeConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRpcInfo()];
                case 1:
                    rpcInfo = _a.sent();
                    // TODO: check for testnet
                    if (rpcInfo) {
                        try {
                            nodeConfig = {
                                username: rpcInfo.rpcuser,
                                password: rpcInfo.rpcpassword,
                                port: rpcInfo.rpcport || '8332',
                                version: '0.20.1'
                            };
                            return [2 /*return*/, Promise.resolve(nodeConfig)];
                        }
                        catch (e) {
                            return [2 /*return*/, Promise.reject('getBitcoinCoreConfig: RPC Info invalid. Make sure node is running.')];
                        }
                    }
                    return [2 /*return*/, Promise.reject('getBitcoinCoreConfig: No RPC Info found')];
            }
        });
    });
}
var getBitcoinCoreBlockchainInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nodeConfig, nodeClient, blockchainInfo, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getBitcoinCoreConfig()]; // this changes currentNodeConfig
            case 1:
                nodeConfig = _a.sent() // this changes currentNodeConfig
                ;
                nodeClient = new Client(nodeConfig);
                return [4 /*yield*/, nodeClient.getBlockchainInfo()];
            case 2:
                blockchainInfo = _a.sent();
                blockchainInfo.provider = 'Bitcoin Core';
                blockchainInfo.connected = true;
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 3:
                e_3 = _a.sent();
                return [2 /*return*/, Promise.reject()];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getCustomNodeBlockchainInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nodeConfig, nodeClient, blockchainInfo, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                nodeConfig = {
                    host: currentNodeConfig.host,
                    username: currentNodeConfig.username,
                    password: currentNodeConfig.password,
                    version: currentNodeConfig.version
                };
                nodeClient = new Client(nodeConfig);
                return [4 /*yield*/, nodeClient.getBlockchainInfo()];
            case 1:
                blockchainInfo = _a.sent();
                blockchainInfo.provider = 'Custom Node';
                blockchainInfo.connected = true;
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 2:
                e_4 = _a.sent();
                return [2 /*return*/, Promise.reject()];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getBlockstreamBlockchainInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, blockchainInfo, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, axios.get("https://blockstream.info/api/blocks/tip/height")];
            case 1: return [4 /*yield*/, (_a.sent()).data];
            case 2:
                data = _a.sent();
                blockchainInfo = {};
                blockchainInfo.blocks = data;
                blockchainInfo.initialblockdownload = false;
                blockchainInfo.provider = 'Blockstream';
                blockchainInfo.connected = true;
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 3:
                e_5 = _a.sent();
                return [2 /*return*/, Promise.reject()];
            case 4: return [2 /*return*/];
        }
    });
}); };
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
ipcMain.on('/account-data', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var config, addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos, nodeClient, nodeClient_1, walletList, walletResp, e_6, ADDRESS_IMPORT_NUM, i, receiveAddress, changeAddress, currentBalance, accountData, e_7;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config = args.config;
                nodeClient = undefined;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 21, , 22]);
                if (!(currentNodeConfig.provider !== 'Blockstream')) return [3 /*break*/, 16];
                nodeClient_1 = new Client({
                    wallet: config.name,
                    host: currentNodeConfig.host || 'http://localhost:8332',
                    username: currentNodeConfig.rpcuser || currentNodeConfig.username,
                    password: currentNodeConfig.rpcpassword || currentNodeConfig.password,
                    version: '0.20.1'
                });
                return [4 /*yield*/, nodeClient_1.listWallets()];
            case 2:
                walletList = _c.sent();
                if (!!walletList.includes(config.name)) return [3 /*break*/, 16];
                _c.label = 3;
            case 3:
                _c.trys.push([3, 5, , 16]);
                return [4 /*yield*/, nodeClient_1.loadWallet({ filename: config.name })];
            case 4:
                walletResp = _c.sent();
                return [3 /*break*/, 16];
            case 5:
                e_6 = _c.sent();
                return [4 /*yield*/, nodeClient_1.createWallet({ wallet_name: config.name })];
            case 6:
                _c.sent();
                if (!(config.quorum.totalSigners === 1)) return [3 /*break*/, 12];
                ADDRESS_IMPORT_NUM = 500;
                i = 0;
                _c.label = 7;
            case 7:
                if (!(i < ADDRESS_IMPORT_NUM)) return [3 /*break*/, 11];
                receiveAddress = getAddressFromAccount(config, "m/0/" + i, currentBitcoinNetwork);
                changeAddress = getAddressFromAccount(config, "m/1/" + i, currentBitcoinNetwork);
                return [4 /*yield*/, nodeClient_1.importAddress({
                        address: receiveAddress.address,
                        rescan: false
                    })];
            case 8:
                _c.sent();
                return [4 /*yield*/, nodeClient_1.importAddress({
                        address: changeAddress.address,
                        rescan: false
                    })];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 7];
            case 11: return [3 /*break*/, 15];
            case 12: // multisig
            //  import receive addresses
            return [4 /*yield*/, nodeClient_1.importMulti({
                    desc: getMultisigDescriptor(nodeClient_1, config.quorum.requiredSigners, config.extendedPublicKeys, true),
                })];
            case 13:
                //  import receive addresses
                _c.sent();
                // import change
                return [4 /*yield*/, nodeClient_1.importMulti({
                        desc: getMultisigDescriptor(nodeClient_1, config.quorum.requiredSigners, config.extendedPublicKeys, false),
                    })];
            case 14:
                // import change
                _c.sent();
                _c.label = 15;
            case 15: return [3 /*break*/, 16];
            case 16:
                if (!(config.quorum.totalSigners > 1)) return [3 /*break*/, 18];
                return [4 /*yield*/, getDataFromMultisig(config, nodeClient, currentBitcoinNetwork)];
            case 17:
                _a = _c.sent(), addresses = _a[0], changeAddresses = _a[1], transactions = _a[2], unusedAddresses = _a[3], unusedChangeAddresses = _a[4], availableUtxos = _a[5];
                return [3 /*break*/, 20];
            case 18: return [4 /*yield*/, getDataFromXPub(config, nodeClient, currentBitcoinNetwork)];
            case 19:
                _b = _c.sent(), addresses = _b[0], changeAddresses = _b[1], transactions = _b[2], unusedAddresses = _b[3], unusedChangeAddresses = _b[4], availableUtxos = _b[5];
                _c.label = 20;
            case 20:
                currentBalance = availableUtxos.reduce(function (accum, utxo) { return accum.plus(utxo.value); }, BigNumber(0));
                accountData = {
                    name: config.name,
                    config: config,
                    addresses: addresses,
                    changeAddresses: changeAddresses,
                    availableUtxos: availableUtxos,
                    transactions: transactions,
                    unusedAddresses: unusedAddresses,
                    currentBalance: currentBalance.toNumber(),
                    unusedChangeAddresses: unusedChangeAddresses
                };
                event.reply('/account-data', accountData);
                return [3 /*break*/, 22];
            case 21:
                e_7 = _c.sent();
                console.log('e: ', e_7);
                return [3 /*break*/, 22];
            case 22: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('/get-config', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getFile('lily-config-encrypted.txt')];
            case 1:
                file = _a.sent();
                return [2 /*return*/, file];
        }
    });
}); });
ipcMain.handle('/save-config', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptedConfigFile;
    return __generator(this, function (_a) {
        encryptedConfigFile = args.encryptedConfigFile;
        return [2 /*return*/, saveFile(encryptedConfigFile, 'lily-config-encrypted.txt')];
    });
}); });
ipcMain.handle('/download-item', function (event, _a) {
    var data = _a.data, filename = _a.filename;
    return __awaiter(void 0, void 0, void 0, function () {
        var win, _b, canceled, filePath, e_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    win = BrowserWindow.getFocusedWindow();
                    return [4 /*yield*/, dialog.showSaveDialog(win, {
                            defaultPath: filename
                        })];
                case 1:
                    _b = _c.sent(), canceled = _b.canceled, filePath = _b.filePath;
                    if (filePath) {
                        fs.writeFile(filePath, data, function (err) {
                            if (err) {
                                return Promise.reject(false);
                            }
                            else {
                                return Promise.resolve(true);
                            }
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_8 = _c.sent();
                    return [2 /*return*/, Promise.reject(false)];
                case 3: return [2 /*return*/];
            }
        });
    });
});
ipcMain.handle('/bitcoin-network', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.resolve(currentBitcoinNetwork)];
    });
}); });
ipcMain.handle('/historical-btc-price', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var historicalBitcoinPrice, priceForChart, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-01-01&end=" + moment().format('YYYY-MM-DD'))];
            case 1: return [4 /*yield*/, (_a.sent()).data];
            case 2:
                historicalBitcoinPrice = _a.sent();
                historicalBitcoinPrice = historicalBitcoinPrice.bpi;
                priceForChart = [];
                for (i = 0; i < Object.keys(historicalBitcoinPrice).length; i++) {
                    priceForChart.push({
                        price: Object.values(historicalBitcoinPrice)[i],
                        date: Object.keys(historicalBitcoinPrice)[i]
                    });
                }
                return [2 /*return*/, Promise.resolve(priceForChart)];
        }
    });
}); });
ipcMain.handle('/enumerate', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, _a, _b, filteredDevices;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, enumerate()];
            case 1:
                resp = _b.apply(_a, [_c.sent()]);
                if (resp.error) {
                    return [2 /*return*/, Promise.reject(new Error('Error enumerating hardware wallets'))];
                }
                filteredDevices = resp.filter(function (device) {
                    return device.type === 'coldcard' || device.type === 'ledger' || device.type === 'trezor';
                });
                return [2 /*return*/, Promise.resolve(filteredDevices)];
        }
    });
}); });
ipcMain.handle('/xpub', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceType, devicePath, path, resp, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                deviceType = args.deviceType, devicePath = args.devicePath, path = args.path;
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getXPub(deviceType, devicePath, path)];
            case 1:
                resp = _b.apply(_a, [_c.sent()]);
                if (resp.error) {
                    return [2 /*return*/, Promise.reject(new Error('Error extracting xpub'))];
                }
                return [2 /*return*/, Promise.resolve(resp)];
        }
    });
}); });
ipcMain.handle('/sign', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceType, devicePath, psbt, resp, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                deviceType = args.deviceType, devicePath = args.devicePath, psbt = args.psbt;
                _b = (_a = JSON).parse;
                return [4 /*yield*/, signtx(deviceType, devicePath, psbt)];
            case 1:
                resp = _b.apply(_a, [_c.sent()]);
                if (resp.error) {
                    return [2 /*return*/, Promise.reject(new Error('Error signing transaction'))];
                }
                return [2 /*return*/, Promise.resolve(resp)];
        }
    });
}); });
ipcMain.handle('/promptpin', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceType, devicePath, resp, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                deviceType = args.deviceType, devicePath = args.devicePath;
                _b = (_a = JSON).parse;
                return [4 /*yield*/, promptpin(deviceType, devicePath)];
            case 1:
                resp = _b.apply(_a, [_c.sent()]);
                if (resp.error) {
                    return [2 /*return*/, Promise.reject(new Error('Error prompting pin'))];
                }
                return [2 /*return*/, Promise.resolve(resp)];
        }
    });
}); });
ipcMain.handle('/sendpin', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceType, devicePath, pin, resp, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                deviceType = args.deviceType, devicePath = args.devicePath, pin = args.pin;
                _b = (_a = JSON).parse;
                return [4 /*yield*/, sendpin(deviceType, devicePath, pin)];
            case 1:
                resp = _b.apply(_a, [_c.sent()]);
                if (resp.error) {
                    return [2 /*return*/, Promise.reject(new Error('Error sending pin'))];
                }
                return [2 /*return*/, Promise.resolve(resp)];
        }
    });
}); });
ipcMain.handle('/estimateFee', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var feeRates, e_9, nodeClient, feeRates, fastestFeeRate, halfHourFeeRate, hourFeeRate, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(currentNodeConfig.provider === 'Blockstream')) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, axios.get('https://mempool.space/api/v1/fees/recommended')];
            case 2: return [4 /*yield*/, (_a.sent()).data];
            case 3:
                feeRates = _a.sent();
                return [2 /*return*/, Promise.resolve(feeRates)];
            case 4:
                e_9 = _a.sent();
                throw new Error('Error retrieving fees from mempool.space. Please try again.');
            case 5: return [3 /*break*/, 12];
            case 6:
                nodeClient = new Client(currentNodeConfig);
                _a.label = 7;
            case 7:
                _a.trys.push([7, 11, , 12]);
                feeRates = {
                    fastestFee: undefined,
                    halfHourFee: undefined,
                    hourFee: undefined
                };
                return [4 /*yield*/, nodeClient.estimateSmartFee(1)];
            case 8:
                fastestFeeRate = _a.sent();
                feeRates.fastestFee = BigNumber(fastestFeeRate.feerate).multipliedBy(100000).integerValue(BigNumber.ROUND_CEIL).toNumber(); // TODO: this probably needs relooked at
                return [4 /*yield*/, nodeClient.estimateSmartFee(3)];
            case 9:
                halfHourFeeRate = _a.sent();
                feeRates.halfHourFee = BigNumber(halfHourFeeRate.feerate).multipliedBy(100000).integerValue(BigNumber.ROUND_CEIL).toNumber(); // TODO: this probably needs relooked at
                return [4 /*yield*/, nodeClient.estimateSmartFee(6)];
            case 10:
                hourFeeRate = _a.sent();
                feeRates.hourFee = BigNumber(hourFeeRate.feerate).multipliedBy(100000).integerValue(BigNumber.ROUND_CEIL).toNumber(); // TODO: this probably needs relooked at
                return [2 /*return*/, Promise.resolve(feeRates)];
            case 11:
                e_10 = _a.sent();
                return [2 /*return*/, Promise.reject(new Error('Error retrieving fee'))];
            case 12: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('/broadcastTx', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var walletName, txHex, nodeClient, resp, e_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walletName = args.walletName, txHex = args.txHex;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                currentNodeConfig.wallet = walletName;
                nodeClient = new Client(currentNodeConfig);
                return [4 /*yield*/, nodeClient.sendRawTransaction(txHex)];
            case 2:
                resp = _a.sent();
                return [2 /*return*/, Promise.resolve(resp)];
            case 3:
                e_11 = _a.sent();
                return [2 /*return*/, Promise.reject(new Error('Error broadcasting transaction'))];
            case 4: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('/changeNodeConfig', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeConfig, blockchainInfo, e_12, blockchainInfo, blockchainInfo, e_13, blockchainInfo, nodeClient, blockchainInfo, e_14, blockchainInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nodeConfig = args.nodeConfig;
                if (!(nodeConfig.provider === 'Bitcoin Core')) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getBitcoinCoreConfig()];
            case 2:
                currentNodeConfig = _a.sent();
                return [4 /*yield*/, getBitcoinCoreBlockchainInfo()];
            case 3:
                blockchainInfo = _a.sent();
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 4:
                e_12 = _a.sent();
                blockchainInfo = {
                    connected: false,
                    provider: 'Bitcoin Core'
                };
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 5: return [3 /*break*/, 14];
            case 6:
                if (!(nodeConfig.provider === 'Blockstream')) return [3 /*break*/, 11];
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                currentNodeConfig = nodeConfig;
                return [4 /*yield*/, getBlockstreamBlockchainInfo()];
            case 8:
                blockchainInfo = _a.sent();
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 9:
                e_13 = _a.sent();
                blockchainInfo = {
                    connected: false,
                    provider: 'Blockstream'
                };
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 10: return [3 /*break*/, 14];
            case 11:
                _a.trys.push([11, 13, , 14]);
                nodeClient = new Client(nodeConfig);
                return [4 /*yield*/, nodeClient.getBlockchainInfo()];
            case 12:
                blockchainInfo = _a.sent();
                // TODO: save nodeConfig to file for later
                saveFile(JSON.stringify(nodeConfig), 'node-config.json');
                blockchainInfo.provider = 'Custom Node';
                blockchainInfo.connected = true;
                currentNodeConfig = nodeConfig;
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 13:
                e_14 = _a.sent();
                console.log('catch e: ', e_14);
                blockchainInfo = {
                    connected: false,
                    provider: 'Custom Node'
                };
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 14: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('/getNodeConfig', function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    var blockchainInfo, e_15, blockchainInfo, blockchainInfo, e_16, blockchainInfo, blockchainInfo, e_17, blockchainInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(currentNodeConfig.provider === 'Bitcoin Core')) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getBitcoinCoreBlockchainInfo()];
            case 2:
                blockchainInfo = _a.sent();
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 3:
                e_15 = _a.sent();
                blockchainInfo = {
                    connected: false,
                    provider: 'Bitcoin Core'
                };
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 4: return [3 /*break*/, 13];
            case 5:
                if (!(currentNodeConfig.provider === 'Blockstream')) return [3 /*break*/, 10];
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, getBlockstreamBlockchainInfo()];
            case 7:
                blockchainInfo = _a.sent();
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 8:
                e_16 = _a.sent();
                blockchainInfo = {
                    connected: false,
                    provider: 'Blockstream'
                };
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 9: return [3 /*break*/, 13];
            case 10:
                _a.trys.push([10, 12, , 13]);
                return [4 /*yield*/, getCustomNodeBlockchainInfo()];
            case 11:
                blockchainInfo = _a.sent();
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 12:
                e_17 = _a.sent();
                blockchainInfo = {
                    connected: false,
                    provider: 'Custom Node'
                };
                return [2 /*return*/, Promise.resolve(blockchainInfo)];
            case 13: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=main.js.map