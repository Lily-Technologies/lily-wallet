const {
  app,
  BrowserWindow,
  ipcMain,
  remote,
  dialog,
  shell,
} = require("electron");
const axios = require("axios");
const moment = require("moment");
const { networks } = require("bitcoinjs-lib");
const BigNumber = require("bignumber.js");

const {
  enumerate,
  getXPub,
  signtx,
  promptpin,
  sendpin,
} = require("./server/commands");
const { getRpcInfo, getClientFromNodeConfig } = require("./server/utils");
const {
  getDataFromMultisig,
  getDataFromXPub,
  loadOrCreateWalletViaRPC,
} = require("./utils/accountMap");

const path = require("path");
const fs = require("fs");

const sleep = async (time) => await new Promise((r) => setTimeout(r, time));

// disable showErrorBox
dialog.showErrorBox = function (title, content) {
  console.log(`${title}\n${content}`);
};

const currentBitcoinNetwork =
  "TESTNET" in process.env ? networks.testnet : networks.bitcoin;

const bitcoinNetworkEqual = (a, b) => {
  return a.bech32 === b.bech32;
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let currentNodeConfig = undefined;

const saveFile = async (file, filename) => {
  const userDataPath = (app || remote.app).getPath("userData");
  const filePath = path.join(userDataPath, filename);
  fs.writeFile(filePath, file, (err) => {
    if (err) {
      return Promise.reject();
    }

    const fileContents = fs.readFileSync(filePath);
    if (fileContents) {
      const stats = fs.statSync(filePath);
      const mtime = stats.mtime;
      return Promise.resolve({
        file: fileContents.toString(),
        modifiedTime: mtime,
      });
    } else {
      return Promise.reject();
    }
  });
};

const getFile = async (filename) => {
  const userDataPath = (app || remote.app).getPath("userData");
  const filePath = path.join(userDataPath, filename);
  const fileContents = fs.readFileSync(filePath);
  if (fileContents) {
    const stats = fs.statSync(filePath);
    const mtime = stats.mtime;
    return Promise.resolve({
      file: fileContents.toString(),
      modifiedTime: mtime,
    });
  } else {
    return Promise.reject();
  }
};

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    backgroundColor: "rgb(245, 247, 250)",
    transparent: true,
    frame: false,
    // icon: path.join(__dirname, '/assets/AppIcon.icns'),
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  mainWindow.setTrafficLightPosition &&
    mainWindow.setTrafficLightPosition({
      x: 10,
      y: 10,
    });

  if ("DEVURL" in process.env) {
    // load dev url
    mainWindow.loadURL(`http://localhost:3001/`);
  } else {
    // load production url
    mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show()
  // })

  mainWindow.webContents.on(
    "new-window",
    (event, url, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault();

      shell.openExternal(url);
      if (frameName === "modal") {
        // open window as modal
        Object.assign(options, {
          modal: true,
          parent: mainWindow,
          width: 100,
          height: 100,
        });
        event.newGuest = new BrowserWindow(options);
      }
    }
  );

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

const setupInitialNodeConfig = async () => {
  try {
    console.log("Trying to connect to local Bitcoin Core instance...");
    const nodeConfig = await getBitcoinCoreConfig();
    const nodeClient = getClientFromNodeConfig(nodeConfig);
    const blockchainInfo = await nodeClient.getBlockchainInfo(); // if fails, go to catch case
    currentNodeConfig = nodeConfig;
    console.log("Connected to local Bitcoin Core instance.");
  } catch (e) {
    console.log("Failed to connect to local Bitcoin Core instance.");
    try {
      try {
        console.log("Trying to connect to remote Bitcoin Core instance...");
        const nodeConfigFile = await getFile("node-config.json");
        const nodeConfig = JSON.parse(nodeConfigFile.file);
        currentNodeConfig = nodeConfig;
      } catch (e) {
        console.log("Failed to retrieve remote Bitcoin Core connection data.");
        console.log("Connecting to Blockstream.");
        currentNodeConfig = {
          provider: "Blockstream",
        };
      }
      const nodeClient = getClientFromNodeConfig(currentNodeConfig);
      console.log(`Verifying connection to ${currentNodeConfig.baseURL})... `);
      const blockchainInfo = await nodeClient.getBlockchainInfo(); // if fails, go to catch case
      console.log(
        `Connected to remote Bitcoin Core instance. (${currentNodeConfig.baseURL})`
      );
    } catch (e) {
      console.log("Failed to connect to remote Bitcoin Core instance.");
    }
  }
};

async function getBitcoinCoreConfig() {
  try {
    const rpcInfo = await getRpcInfo();
    // TODO: check for testnet
    if (rpcInfo) {
      try {
        const nodeConfig = {
          username: rpcInfo.rpcuser,
          password: rpcInfo.rpcpassword,
          port: rpcInfo.rpcport || "8332",
          version: "0.20.1",
        };
        return Promise.resolve(nodeConfig);
      } catch (e) {
        return Promise.reject(
          "getBitcoinCoreConfig: RPC Info invalid. Make sure node is running."
        );
      }
    }
    return Promise.reject("getBitcoinCoreConfig: No RPC Info found");
  } catch (e) {
    return Promise.reject("getBitcoinCoreConfig: No RPC Info found");
  }
}

const getBitcoinCoreBlockchainInfo = async () => {
  try {
    const nodeConfig = await getBitcoinCoreConfig(); // this changes currentNodeConfig
    const nodeClient = getClientFromNodeConfig(nodeConfig);
    const blockchainInfo = await nodeClient.getBlockchainInfo();
    blockchainInfo.provider = "Bitcoin Core";
    blockchainInfo.connected = true;
    return Promise.resolve(blockchainInfo);
  } catch (e) {
    return Promise.reject();
  }
};

const getCustomNodeBlockchainInfo = async () => {
  try {
    const nodeClient = getClientFromNodeConfig(currentNodeConfig);
    const blockchainInfo = await nodeClient.getBlockchainInfo();
    blockchainInfo.provider = "Custom Node";
    blockchainInfo.connected = true;
    return Promise.resolve(blockchainInfo);
  } catch (e) {
    console.log("getCustomNodeBlockchainInfo e: ", e);
    return Promise.reject("Error getting custom node blockchain info");
  }
};

const getBlockstreamBlockchainInfo = async () => {
  try {
    const data = await (
      await axios.get(`https://blockstream.info/api/blocks/tip/height`)
    ).data;
    let blockchainInfo = {};
    blockchainInfo.blocks = data;
    blockchainInfo.initialblockdownload = false;
    blockchainInfo.provider = "Blockstream";
    blockchainInfo.connected = true;
    return Promise.resolve(blockchainInfo);
  } catch (e) {
    return Promise.reject();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("ready", setupInitialNodeConfig);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("/account-data", async (event, args) => {
  const { config } = args;

  // load data from cache
  // event.reply("/account-data", accountData);

  // load new data
  let addresses,
    changeAddresses,
    transactions,
    unusedAddresses,
    unusedChangeAddresses,
    availableUtxos;
  let nodeClient = undefined;
  try {
    if (currentNodeConfig.provider !== "Blockstream") {
      const currentConfig = { ...currentNodeConfig };
      currentConfig.baseURL = `${currentConfig.baseURL}/wallet/lily${config.id}`;
      nodeClient = getClientFromNodeConfig(currentConfig);

      // loading from Lily Docker app and return early
      if (nodeClient.getAccountData) {
        console.log(`Getting data from Docker app ${currentConfig.baseURL}`);
        const accountData = await nodeClient.getAccountData(config);
        event.reply("/account-data", accountData);
        return;
      }

      // load or create wallet via RPC from RPC
      console.log(`Loading or creating wallet via RPC (${config.id})`);
      await loadOrCreateWalletViaRPC(config, nodeClient);
    }

    if (config.quorum.totalSigners > 1) {
      [
        addresses,
        changeAddresses,
        transactions,
        unusedAddresses,
        unusedChangeAddresses,
        availableUtxos,
      ] = await getDataFromMultisig(config, nodeClient, currentBitcoinNetwork);
    } else {
      [
        addresses,
        changeAddresses,
        transactions,
        unusedAddresses,
        unusedChangeAddresses,
        availableUtxos,
      ] = await getDataFromXPub(config, nodeClient, currentBitcoinNetwork);
    }

    console.log(`Calculating current balance for ${config.id}`);
    const currentBalance = availableUtxos.reduce(
      (accum, utxo) => accum.plus(utxo.value),
      BigNumber(0)
    );

    let loading = false;
    if (nodeClient) {
      const resp = await nodeClient.getWalletInfo();
      // TODO: should check if keypool is > 0
      loading = resp.scanning;
    }

    const accountData = {
      name: config.name,
      config: config,
      addresses,
      changeAddresses,
      availableUtxos,
      transactions,
      unusedAddresses,
      currentBalance: currentBalance.toNumber(),
      unusedChangeAddresses,
      loading,
    };

    event.reply("/account-data", accountData);
  } catch (e) {
    console.log(`(${config.id}) /account-data error: `, e.message);
  }
});

ipcMain.handle("/quit", () => {
  app.quit();
});

ipcMain.handle("/get-config", async (event, args) => {
  try {
    const file = await getFile("lily-config-encrypted.txt");
    return file;
  } catch (e) {
    console.log("Failed to get Lily config");
  }
});

ipcMain.handle("/save-config", async (event, args) => {
  const { encryptedConfigFile } = args;
  return saveFile(encryptedConfigFile, "lily-config-encrypted.txt");
});

ipcMain.handle("/download-item", async (event, { data, filename }) => {
  try {
    const win = BrowserWindow.getFocusedWindow();

    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: filename,
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

ipcMain.handle("/bitcoin-network", async (event, args) => {
  return Promise.resolve(currentBitcoinNetwork);
});

ipcMain.handle("/historical-btc-price", async (event, args) => {
  let historicalBitcoinPrice = await (
    await axios.get(
      `https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-01-01&end=${moment().format(
        "YYYY-MM-DD"
      )}`
    )
  ).data;
  historicalBitcoinPrice = historicalBitcoinPrice.bpi;
  let priceForChart = [];
  for (let i = 0; i < Object.keys(historicalBitcoinPrice).length; i++) {
    priceForChart.push({
      price: Object.values(historicalBitcoinPrice)[i],
      date: Object.keys(historicalBitcoinPrice)[i],
    });
  }
  return Promise.resolve(priceForChart);
});

ipcMain.handle("/enumerate", async (event, args) => {
  const resp = JSON.parse(await enumerate());
  if (resp.error) {
    return Promise.reject(new Error("Error enumerating hardware wallets"));
  }
  const filteredDevices = resp.filter((device) => {
    return (
      device.type === "coldcard" ||
      device.type === "ledger" ||
      device.type === "trezor" ||
      device.type === "bitbox02"
    );
  });
  return Promise.resolve(filteredDevices);
});

ipcMain.handle("/xpub", async (event, args) => {
  const { deviceType, devicePath, path } = args;
  const resp = JSON.parse(
    await getXPub(
      deviceType,
      devicePath,
      path,
      bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet)
    )
  ); // responses come back as strings, need to be parsed
  if (resp.error) {
    return Promise.reject(new Error("Error extracting xpub"));
  }
  return Promise.resolve(resp);
});

ipcMain.handle("/sign", async (event, args) => {
  const { deviceType, devicePath, psbt } = args;
  const resp = JSON.parse(
    await signtx(
      deviceType,
      devicePath,
      psbt,
      bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet)
    )
  );
  if (resp.error) {
    return Promise.reject(new Error("Error signing transaction"));
  }
  return Promise.resolve(resp);
});

ipcMain.handle("/promptpin", async (event, args) => {
  const { deviceType, devicePath } = args;
  const resp = JSON.parse(await promptpin(deviceType, devicePath));
  if (resp.error) {
    return Promise.reject(new Error("Error prompting pin"));
  }
  return Promise.resolve(resp);
});

ipcMain.handle("/sendpin", async (event, args) => {
  const { deviceType, devicePath, pin } = args;
  const resp = JSON.parse(await sendpin(deviceType, devicePath, pin));
  if (resp.error) {
    return Promise.reject(new Error("Error sending pin"));
  }
  return Promise.resolve(resp);
});

ipcMain.handle("/estimate-fee", async (event, args) => {
  if (currentNodeConfig.provider === "Blockstream") {
    try {
      const feeRates = await (
        await axios.get("https://mempool.space/api/v1/fees/recommended")
      ).data; // TODO: should catch if URL is down
      return Promise.resolve(feeRates);
    } catch (e) {
      throw new Error(
        "Error retrieving fees from mempool.space. Please try again."
      );
    }
  } else {
    const nodeClient = getClientFromNodeConfig(currentNodeConfig);
    try {
      const feeRates = {
        fastestFee: undefined,
        halfHourFee: undefined,
        hourFee: undefined,
      };
      const fastestFeeRate = await nodeClient.estimateSmartFee(1);
      feeRates.fastestFee = BigNumber(fastestFeeRate.feerate)
        .multipliedBy(100000)
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber(); // TODO: this probably needs relooked at
      const halfHourFeeRate = await nodeClient.estimateSmartFee(3);
      feeRates.halfHourFee = BigNumber(halfHourFeeRate.feerate)
        .multipliedBy(100000)
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber(); // TODO: this probably needs relooked at
      const hourFeeRate = await nodeClient.estimateSmartFee(6);
      feeRates.hourFee = BigNumber(hourFeeRate.feerate)
        .multipliedBy(100000)
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber(); // TODO: this probably needs relooked at
      return Promise.resolve(feeRates);
    } catch (e) {
      console.log(`error /estimate-fee ${e.message}`);
      return Promise.reject(new Error("Error retrieving fee"));
    }
  }
});

ipcMain.handle("/broadcastTx", async (event, args) => {
  const { walletName, txHex } = args;
  try {
    currentNodeConfig.wallet = walletName;
    const nodeClient = getClientFromNodeConfig(currentNodeConfig);
    const resp = await nodeClient.sendRawTransaction(txHex);
    return Promise.resolve(resp);
  } catch (e) {
    console.log(`error /broadcastTx ${e.message}`);
    return Promise.reject(new Error("Error broadcasting transaction"));
  }
});

ipcMain.handle("/changeNodeConfig", async (event, args) => {
  const { nodeConfig } = args;
  console.log(`Attempting to connect to ${nodeConfig.provider}...`);
  if (nodeConfig.provider === "Bitcoin Core") {
    try {
      currentNodeConfig = await getBitcoinCoreConfig();
      const blockchainInfo = await getBitcoinCoreBlockchainInfo();
      console.log(`Connected to ${nodeConfig.provider}.`);
      return Promise.resolve(blockchainInfo);
    } catch (e) {
      console.log("Failed to connect to Bitcoin Core");
      const blockchainInfo = {
        connected: false,
        provider: "Bitcoin Core",
      };
      return Promise.resolve(blockchainInfo);
    }
  } else if (nodeConfig.provider === "Blockstream") {
    try {
      currentNodeConfig = nodeConfig;
      const blockchainInfo = await getBlockstreamBlockchainInfo();
      console.log(`Connected to ${nodeConfig.provider}.`);
      return Promise.resolve(blockchainInfo);
    } catch (e) {
      console.log("Failed to connect to Blockstream");
      const blockchainInfo = {
        connected: false,
        provider: "Blockstream",
      };
      return Promise.resolve(blockchainInfo);
    }
  } else {
    // custom
    try {
      console.log(`Attempting to connect to ${nodeConfig.baseURL}`);
      const nodeClient = getClientFromNodeConfig(nodeConfig);
      const blockchainInfo = await nodeClient.getBlockchainInfo();
      saveFile(JSON.stringify(nodeConfig), "node-config.json");
      blockchainInfo.provider = "Custom Node";
      blockchainInfo.baseURL = nodeConfig.baseURL;
      blockchainInfo.connected = true;
      currentNodeConfig = nodeConfig;
      console.log(`Connected to ${nodeConfig.baseURL}`);
      return Promise.resolve(blockchainInfo);
    } catch (e) {
      console.log(`Failed to connect to ${nodeConfig.baseURL} (error: ${e})`);
      const blockchainInfo = {
        connected: false,
        provider: "Custom Node",
        baseURL: nodeConfig.baseURL,
      };
      return Promise.reject(blockchainInfo);
    }
  }
});

ipcMain.handle("/get-node-config", async (event, args) => {
  if (currentNodeConfig?.provider === "Bitcoin Core") {
    try {
      const blockchainInfo = await getBitcoinCoreBlockchainInfo();
      return Promise.resolve(blockchainInfo);
    } catch (e) {
      const blockchainInfo = {
        connected: false,
        provider: "Bitcoin Core",
      };
      return Promise.resolve(blockchainInfo);
    }
  } else if (currentNodeConfig?.provider === "Blockstream") {
    try {
      const blockchainInfo = await getBlockstreamBlockchainInfo();
      return Promise.resolve(blockchainInfo);
    } catch (e) {
      const blockchainInfo = {
        connected: false,
        provider: "Blockstream",
      };
      return Promise.resolve(blockchainInfo);
    }
  } else {
    try {
      const blockchainInfo = await getCustomNodeBlockchainInfo();
      return Promise.resolve({
        provider: "Custom Node",
        baseURL: currentNodeConfig.baseURL,
        ...blockchainInfo,
      });
    } catch (e) {
      const blockchainInfo = {
        connected: false,
        provider: "Custom Node",
      };
      console.log(`error /get-node-config ${e}`);
      return Promise.resolve(blockchainInfo);
    }
  }
});

ipcMain.handle("/rescanBlockchain", async (event, args) => {
  const { currentAccount, startHeight } = args;
  try {
    if (currentNodeConfig.provider !== "Blockstream") {
      const currentConfig = { ...currentNodeConfig };
      currentConfig.baseURL = `${currentNodeConfig.baseURL}/wallet/lily${currentAccount.config.id}`;
      const nodeClient = getClientFromNodeConfig(currentConfig);

      // don't await this call because it always times out, just trust that it's happening
      // and then we verify via response from getwalletinfo
      nodeClient.rescanBlockchain(parseInt(startHeight));

      sleep(100);
      const walletInfo = await nodeClient.getWalletInfo();
      if (walletInfo.scanning) {
        return Promise.resolve({ success: true });
      } else {
        throw new Error(`Wallet isnt scanning ${currentAccount.config.id}`);
      }
    }
  } catch (e) {
    console.log(`error /rescanBlockchain ${e.message}`);
    return Promise.reject({ success: false, error: e.message });
  }
});

ipcMain.handle("/getWalletInfo", async (event, args) => {
  const { currentAccount } = args;
  try {
    const currentConfig = { ...currentNodeConfig };
    currentConfig.baseURL = `${currentNodeConfig.baseURL}/wallet/lily${currentAccount.config.id}`;
    const nodeClient = getClientFromNodeConfig(currentConfig);
    const walletInfo = await nodeClient.getWalletInfo();
    return Promise.resolve({ ...walletInfo });
  } catch (e) {
    console.log(`error /getWalletInfo ${e.message}`);
    return Promise.reject({ success: false, error: e.message });
  }
});

ipcMain.handle("/isConfirmedTransaction", async (event, args) => {
  const { txId } = args;
  if (txId.length === 64) {
    try {
      if (currentNodeConfig.provider === "Blockstream") {
        const data = await (
          await axios.get(`https://blockstream.info/api/tx/${txId}/status`)
        ).data;
        if (!!data.confirmed) {
          return Promise.resolve(true);
        }
        throw new Error(`Transaction not confirmed (${txId})`);
      } else {
        const currentConfig = { ...currentNodeConfig };
        const nodeClient = getClientFromNodeConfig(currentConfig);
        const transaction = await nodeClient.getRawTransaction(txId, true);
        if (transaction.confirmations > 0) {
          return Promise.resolve(true);
        }
        throw new Error(`Transaction not confirmed (${txId})`);
      }
    } catch (e) {
      console.log(`error /isConfirmedTransaction ${e.message}`);
      return Promise.reject({ success: false, error: e.message });
    }
  }
  console.log(`error /isConfirmedTransaction: Invalid txId`);
  return Promise.reject({ success: false });
});
