import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import axios from "axios";
import { blockExplorerAPIURL } from "unchained-bitcoin";
import moment from "moment";
import { networks } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";
import crypto from "crypto";
import {
  ClientOption,
  FetchedRawTransaction,
  WalletInfo,
} from "bitcoin-simple-rpc";
import createLnRpc, { InvoiceState } from "@radar/lnrpc";
import { parseLndConnectUri } from "./utils/lightning";

import {
  enumerate,
  getXPub,
  signtx,
  promptpin,
  sendpin,
} from "./server/commands";
import {
  getClientFromNodeConfig,
  getFile,
  saveFile,
  getTxIdFromChannelPoint,
  getBitcoinCoreConfig,
  bitcoinNetworkEqual,
  sleep,
  getErrorMessageFromChunk,
} from "./server/utils";
import {
  getDataFromMultisig,
  getDataFromXPub,
  loadOrCreateWalletViaRPC,
} from "./utils/accountMap";

import path from "path";
import fs from "fs";
import {
  BalanceHistory,
  NodeConfigWithBlockchainInfo,
  LilyOnchainAccount,
  NodeConfig,
  LightningEvent,
  DecoratedPendingLightningChannel,
  DecoratedLightningChannel,
  HwiResponseEnumerate,
  FeeRates,
} from "./types";

// disable showErrorBox
dialog.showErrorBox = function (title, content) {
  console.log(`${title}\n${content}`);
};

const currentBitcoinNetwork =
  "TESTNET" in process.env ? networks.testnet : networks.bitcoin;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

let currentNodeConfig: NodeConfigWithBlockchainInfo;

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
      nodeIntegration: false,
      contextIsolation: true,
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
    currentNodeConfig = {
      ...blockchainInfo,
      ...nodeConfig,
      provider: "Bitcoin Core",
      connected: true,
    };
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
        const blockchainInfo = await getBlockstreamBlockchainInfo();
        currentNodeConfig = {
          ...blockchainInfo,
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

const getBitcoinCoreNetworkConnectionInfo = async () => {
  try {
    const nodeConfig = await getBitcoinCoreConfig(); // this changes currentNodeConfig
    const nodeClient = getClientFromNodeConfig(nodeConfig);
    const blockchainInfo = await nodeClient.getBlockchainInfo();
    const bitcoinNetworkInfo = {
      ...blockchainInfo,
      ...nodeConfig,
      provider: "Bitcoin Core",
      connected: true,
    } as NodeConfigWithBlockchainInfo;
    return Promise.resolve(bitcoinNetworkInfo);
  } catch (e) {
    return Promise.reject();
  }
};

const getCustomNodeBlockchainInfo = async (nodeConfig: ClientOption) => {
  try {
    const nodeClient = getClientFromNodeConfig(nodeConfig);
    const blockchainInfo = await nodeClient.getBlockchainInfo();
    const bitcoinNetworkInfo = {
      ...blockchainInfo,
      ...nodeConfig,
      provider: "Custom Node",
      connected: true,
    } as NodeConfigWithBlockchainInfo;
    return Promise.resolve(bitcoinNetworkInfo);
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
    const blockchainInfo = {
      blocks: data,
      initialblockdownload: false,
      provider: "Blockstream",
      connected: true,
    } as NodeConfigWithBlockchainInfo;
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
      new BigNumber(0)
    );

    let loading: boolean | WalletInfo["scanning"] = false;
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
    } as LilyOnchainAccount;

    event.reply("/account-data", accountData);
  } catch (e) {
    console.log(`(${config.id}) /account-data error: `, e);
  }
});

ipcMain.on("/open-channel", async (event, args) => {
  const { lightningAddress, channelAmount, lndConnectUri } = args;
  try {
    const lnRpcClient = await createLnRpc(parseLndConnectUri(lndConnectUri));

    // connect to peer
    const { peers } = await lnRpcClient.listPeers();
    const [pubkey, host] = lightningAddress.split("@");

    // if we aren't connected to peer, then connect
    if (!peers.some((peer) => peer.pubKey === pubkey)) {
      console.log(`connecting to peer ${lightningAddress}...`);
      const connectPeerResponse = await lnRpcClient.connectPeer({
        addr: {
          pubkey,
          host,
        },
      });
      console.log(`connected to peer ${lightningAddress}`);
    }

    const pendingChannelId = crypto.randomBytes(32);
    const openChannelOptions = {
      nodePubkey: Buffer.from(pubkey, "hex"),
      localFundingAmount: channelAmount,
      pushSat: "0",
      // private?
      fundingShim: {
        psbtShim: {
          pendingChanId: pendingChannelId,
        },
      },
    };

    console.log(`attempting channel open to ${lightningAddress}...`);
    const openingNodeInfo = await lnRpcClient.getNodeInfo({
      pubKey: pubkey,
    });

    const channelResponse = await lnRpcClient.openChannel(openChannelOptions);

    channelResponse.on("data", (chunk) => {
      try {
        console.log("chunk: ", chunk);
        if (chunk.psbtFund) {
          const openChannelData = {
            ...chunk,
            alias: openingNodeInfo.node!.alias,
            color: openingNodeInfo.node!.color,
          };
          event.reply("/open-channel", openChannelData);
        } else if (chunk.chanPending) {
          event.reply("/open-channel", chunk);
        }
      } catch (e) {
        event.reply("/open-channel", {
          error: {
            message: e,
          },
        });
      }
    });
    channelResponse.on("error", (chunk) => {
      console.log(
        "channelResponse error.message: ",
        getErrorMessageFromChunk(chunk.message)
      );
      event.reply("/open-channel", {
        error: {
          message: getErrorMessageFromChunk(chunk.message),
        },
      });
    });
    channelResponse.on("end", () => console.log("/open-channel end"));
  } catch (e) {
    console.log("error opening channel: ", e);
    event.reply("/open-channel", {
      error: {
        message: e,
      },
    });
  }
});

ipcMain.on("/open-channel-verify", async (event, args) => {
  const { finalPsbt, pendingChanId, lndConnectUri } = args; // unsigned psbt
  console.log('hits "/open-channel-verify');

  try {
    const lnRpcClient = await createLnRpc(parseLndConnectUri(lndConnectUri));

    const response = await lnRpcClient.fundingStateStep({
      psbtVerify: {
        fundedPsbt: Buffer.from(finalPsbt, "base64"),
        pendingChanId: pendingChanId,
      },
    });
    console.log("/open-channel-verify response: ", response);
  } catch (e) {
    console.log("/open-channel-verify error: ", e);
  }
});

ipcMain.on("/open-channel-finalize", async (event, args) => {
  const { finalPsbt, pendingChanId, lndConnectUri } = args; // signed psbt

  try {
    const lnRpcClient = await createLnRpc(parseLndConnectUri(lndConnectUri));

    const response = await lnRpcClient.fundingStateStep({
      psbtFinalize: {
        signedPsbt: Buffer.from(finalPsbt, "base64"),
        pendingChanId: pendingChanId,
      },
    });

    console.log("/open-channel-finalize response: ", response);
  } catch (e) {
    console.log("/open-channel-finalize error: ", e);
  }
});

ipcMain.on("/close-channel", async (event, args) => {
  const { channel_point, delivery_address, lndConnectUri } = args;
  console.log(
    "/close-channel: channel_point, delivery_address, lndConnectUri",
    channel_point,
    delivery_address,
    lndConnectUri
  );

  try {
    const lnRpcClient = await createLnRpc(parseLndConnectUri(lndConnectUri));

    const closeChannelResponse = await lnRpcClient.closeChannel({
      channelPoint: {
        fundingTxidStr: getTxIdFromChannelPoint(channel_point),
        outputIndex: channel_point.substring(channel_point.indexOf(":")),
      },
      deliveryAddress: delivery_address,
    });

    closeChannelResponse.on("data", (chunk) => {
      console.log("/close-channel data: ", chunk);
      event.reply("/close-channel", chunk);
    });

    closeChannelResponse.on("error", (chunk) => {
      console.log("/close-channel error: ", chunk);
      event.reply("/close-channel", {
        error: {
          message: getErrorMessageFromChunk(chunk.message),
        },
      });
    });

    closeChannelResponse.on("end", () => {
      console.log("/close-channel end");
    });
  } catch (e) {
    console.log("/close-channel error: ", e);
    event.reply("/close-channel", {
      error: {
        message: e,
      },
    });
  }
});

ipcMain.on("/lightning-account-data", async (event, args) => {
  const { config } = args;
  console.log(`Connecting to ${config.name}...`);
  try {
    const lnRpcClient = await createLnRpc(
      parseLndConnectUri(config.connectionDetails.lndConnectUri)
    );

    const { channels } = await lnRpcClient.listChannels();
    const { channels: closedChannels } = await lnRpcClient.closedChannels();
    let { pendingOpenChannels, waitingCloseChannels } =
      await lnRpcClient.pendingChannels();
    const info = await lnRpcClient.getInfo();
    const balance = await lnRpcClient.channelBalance();
    // const { transactions } = await lnRpcClient.getTransactions();
    const { payments } = await lnRpcClient.listPayments();
    const { invoices } = await lnRpcClient.listInvoices();

    if (!pendingOpenChannels) {
      pendingOpenChannels = [];
    }

    if (!waitingCloseChannels) {
      waitingCloseChannels = [];
    }

    const incomingTxs = invoices.reduce((filtered, invoice) => {
      if (
        invoice.state !== InvoiceState.CANCELED &&
        invoice.state !== InvoiceState.OPEN
      ) {
        const decoratedInvoice = {
          ...invoice,
          valueSat: invoice.amtPaidSat,
          title: invoice.memo,
          type: "PAYMENT_RECEIVE",
        } as LightningEvent;
        filtered.push(decoratedInvoice);
      }
      return filtered;
    }, [] as LightningEvent[]);

    const outgoingTxs = await Promise.all(
      payments.map(async (payment) => {
        const decoratedPayment = {
          ...payment,
          type: "PAYMENT_SEND",
          title: "",
        } as LightningEvent;
        if (payment.paymentRequest) {
          const decodedPaymentRequest = await lnRpcClient.decodePayReq({
            payReq: payment.paymentRequest,
          });
          decoratedPayment.title = decodedPaymentRequest.description;
        }

        return decoratedPayment;
      })
    );

    let closedChannelActivity: LightningEvent[] = [];
    for (let i = 0; i < closedChannels.length; i++) {
      const txId = getTxIdFromChannelPoint(closedChannels[i].channelPoint);

      console.log(
        "closedChannels[i].channelPoint: ",
        closedChannels[i].channelPoint
      );
      console.log("txId: ", txId);
      // TODO: use general method to get tx
      const channelOpenTx = await (
        await axios.get(blockExplorerAPIURL(`/tx/${txId}`, "mainnet"))
      ).data;
      console.log("channelOpenTx: ", channelOpenTx);

      let alias = closedChannels[i].remotePubkey;
      try {
        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: closedChannels[i].remotePubkey,
        });
        alias = openingNodeInfo!.node!.alias;
      } catch (e) {
        console.log("error getting alias: ", e);
      }

      const channelOpen = {
        type: "CHANNEL_OPEN",
        creationDate: channelOpenTx.status.block_time,
        title: `Open channel to ${alias}`,
        valueSat: closedChannels[i].capacity,
        tx: channelOpenTx,
      } as LightningEvent;
      closedChannelActivity.push(channelOpen);

      const channelCloseTx = await (
        await axios.get(
          blockExplorerAPIURL(
            `/tx/${closedChannels[i].closingTxHash}`,
            "mainnet"
          )
        )
      ).data;

      console.log("closedChannels[i]: ", closedChannels[i]);
      const channelClose = {
        type: "CHANNEL_CLOSE",
        creationDate: channelCloseTx.status.block_time,
        title: `Close channel to ${alias}`,
        valueSat:
          closedChannels[i].settledBalance || closedChannels[i].capacity,
        tx: channelCloseTx,
      } as LightningEvent;
      closedChannelActivity.push(channelClose);
    }

    const pendingOpenChannelsDecorated: DecoratedPendingLightningChannel[] = [];
    const pendingChannelOpenActivity: LightningEvent[] = [];
    for (let i = 0; i < pendingOpenChannels.length; i++) {
      const { channel } = pendingOpenChannels[i];
      if (channel) {
        const txId = getTxIdFromChannelPoint(channel.channelPoint);
        const channelOpenTx = await (
          await axios.get(blockExplorerAPIURL(`/tx/${txId}`, "mainnet"))
        ).data;

        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: channel.remoteNodePub,
        });

        pendingChannelOpenActivity.push({
          type: "CHANNEL_OPEN",
          creationDate: undefined,
          title: `Open channel to ${openingNodeInfo?.node?.alias}`,
          valueSat: channel.capacity,
          tx: channelOpenTx,
        });

        pendingOpenChannelsDecorated.push({
          ...channel,
          alias: openingNodeInfo?.node?.alias || channel.remoteNodePub,
        });
      }
    }

    const pendingCloseChannelsDecorated: DecoratedPendingLightningChannel[] =
      [];
    const pendingChannelCloseActivity: LightningEvent[] = [];
    for (let i = 0; i < waitingCloseChannels.length; i++) {
      const { channel } = waitingCloseChannels[i];
      if (channel) {
        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: channel.remoteNodePub,
        });

        pendingChannelCloseActivity.push({
          type: "CHANNEL_CLOSE",
          creationDate: undefined,
          title: `Close channel to ${openingNodeInfo?.node?.alias}`,
          valueSat: channel.capacity,
        });

        pendingCloseChannelsDecorated.push({
          ...channel,
          alias: openingNodeInfo?.node?.alias || channel.remoteNodePub,
        });
      }
    }

    const decoratedOpenChannels: DecoratedLightningChannel[] = [];
    const openChannelActivity: LightningEvent[] = [];
    for (let i = 0; i < channels.length; i++) {
      const txId = getTxIdFromChannelPoint(channels[i].channelPoint);
      const channelOpenTx = await (
        await axios.get(blockExplorerAPIURL(`/tx/${txId}`, "mainnet"))
      ).data;

      let alias = channels[i].remotePubkey;
      try {
        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: channels[i].remotePubkey,
        });
        if (openingNodeInfo?.node?.alias) {
          alias = openingNodeInfo.node.alias;
        }
      } catch (e) {
        console.log("error getting alias: ", e);
      }

      try {
        const detailedChannelInfo = await lnRpcClient.getChanInfo({
          chanId: channels[i].chanId,
        });
        decoratedOpenChannels.push({
          ...channels[i],
          lastUpdate: detailedChannelInfo.lastUpdate,
          alias: alias,
        });
      } catch (e) {
        console.log("error (/lightning-account-data) getChanInfo", e);
      }

      openChannelActivity.push({
        type: "CHANNEL_OPEN",
        creationDate: channelOpenTx.status.block_time,
        title: `Open channel to ${alias}`,
        valueSat: channels[i].capacity,
        tx: channelOpenTx,
      });
    }

    const sortedEvents = [
      ...outgoingTxs,
      ...incomingTxs,
      ...closedChannelActivity,
      ...openChannelActivity,
      ...pendingChannelOpenActivity,
      ...pendingChannelCloseActivity,
    ].sort((a, b) => {
      if (!b.creationDate && !a.creationDate) {
        return 0;
      } else if (!b.creationDate) {
        return -1;
      } else if (!a.creationDate) {
        return -1;
      }
      return Number(b.creationDate) - Number(a.creationDate);
    });

    let balanceHistory: BalanceHistory[] = [];
    if (sortedEvents.length) {
      balanceHistory = [
        {
          blockTime:
            Number(sortedEvents[sortedEvents.length - 1].creationDate) - 1,
          totalValue: 0,
        },
      ];

      for (let i = sortedEvents.length - 1; i >= 0; i--) {
        const currentEvent = sortedEvents[i];
        let currentValue = balanceHistory[balanceHistory.length - 1].totalValue;
        if (
          currentEvent.type === "CHANNEL_OPEN" ||
          currentEvent.type === "PAYMENT_RECEIVE"
        ) {
          currentValue += Number(currentEvent.valueSat);
        } else {
          currentValue -= Number(currentEvent.valueSat);
        }

        balanceHistory.push({
          blockTime: currentEvent.creationDate
            ? Number(currentEvent.creationDate)
            : undefined,
          totalValue: new BigNumber(currentValue).toNumber(),
        });
      }

      balanceHistory.push({
        blockTime: Math.floor(Date.now() / 1000),
        totalValue: new BigNumber(
          balanceHistory[balanceHistory.length - 1].totalValue
        ).toNumber(),
      });
    }

    const accountData = {
      name: config.name,
      config: config,
      channels: decoratedOpenChannels,
      pendingChannels: [
        ...pendingOpenChannelsDecorated,
        ...pendingCloseChannelsDecorated,
      ],
      closedChannels: closedChannels,
      info: info,
      loading: false,
      events: sortedEvents,
      payments: payments,
      invoices: invoices,
      currentBalance: balance,
      balanceHistory: balanceHistory,
    };
    console.log("accountData: ", accountData);
    event.reply("/lightning-account-data", accountData);
  } catch (e) {
    console.log(`(${config.id}) /lightning-account-data: `, e);
  }
});

ipcMain.handle("/lightning-connect", async (event, args) => {
  const { lndConnectUri } = args;
  try {
    const lnRpcClient = await createLnRpc(parseLndConnectUri(lndConnectUri));

    const info = await lnRpcClient.getInfo();
    return Promise.resolve(info);
  } catch (e) {
    return Promise.reject("fail");
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

    const { canceled, filePath } = await dialog.showSaveDialog(win!, {
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
  try {
    const resp = JSON.parse(await enumerate());
    if (resp.error) {
      return Promise.reject(new Error("Error enumerating hardware wallets"));
    }
    const filteredDevices = (resp as HwiResponseEnumerate[]).filter(
      (device) => {
        return (
          device.type === "coldcard" ||
          device.type === "ledger" ||
          device.type === "trezor" ||
          device.type === "bitbox02"
        );
      }
    );
    return Promise.resolve(filteredDevices);
  } catch (e) {
    console.log("/enumerate error: ", e);
  }
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
        fastestFee: 0,
        halfHourFee: 0,
        hourFee: 0,
      } as FeeRates;
      const fastestFeeRate = await nodeClient.estimateSmartFee(1);
      if (fastestFeeRate.feerate) {
        feeRates.fastestFee = new BigNumber(fastestFeeRate.feerate)
          .multipliedBy(100000)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(); // TODO: this probably needs relooked at
      }
      const halfHourFeeRate = await nodeClient.estimateSmartFee(3);
      if (halfHourFeeRate.feerate) {
        feeRates.halfHourFee = new BigNumber(halfHourFeeRate.feerate)
          .multipliedBy(100000)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(); // TODO: this probably needs relooked at
      }
      const hourFeeRate = await nodeClient.estimateSmartFee(6);
      if (hourFeeRate.feerate) {
        feeRates.hourFee = new BigNumber(hourFeeRate.feerate)
          .multipliedBy(100000)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(); // TODO: this probably needs relooked at
      }
      return Promise.resolve(feeRates);
    } catch (e) {
      console.log(`error /estimate-fee ${e}`);
      return Promise.reject(new Error("Error retrieving fee"));
    }
  }
});

ipcMain.handle("/broadcastTx", async (event, args) => {
  const { accountId, txHex } = args;
  try {
    const nodeConnection = {
      ...currentNodeConfig,
      baseURL: `${currentNodeConfig.baseURL}/wallet/lily${accountId}`,
    };
    const nodeClient = getClientFromNodeConfig(nodeConnection);
    const resp = await nodeClient.sendRawTransaction(txHex);
    return Promise.resolve(resp);
  } catch (e) {
    console.log(`error /broadcastTx ${e}`);
    return Promise.reject(new Error("Error broadcasting transaction"));
  }
});

ipcMain.handle("/changeNodeConfig", async (event, args) => {
  const { nodeConfig } = args;
  console.log(`Attempting to connect to ${nodeConfig.provider}...`);
  if (nodeConfig.provider === "Bitcoin Core") {
    try {
      const temp = await getBitcoinCoreConfig();
      const blockchainInfo = await getBitcoinCoreNetworkConnectionInfo();
      console.log(`Connected to ${nodeConfig.provider}.`);
      currentNodeConfig = {
        ...temp,
        provider: "Bitcoin Core",
        connected: true,
        blocks: blockchainInfo.blocks,
      };
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
      const nodeConfigWithChainInfo = {
        ...blockchainInfo,
        provider: "Custom Node",
        baseURL: nodeConfig.baseURL,
        connected: true,
      } as NodeConfigWithBlockchainInfo;
      currentNodeConfig = nodeConfigWithChainInfo;
      console.log(`Connected to ${nodeConfig.baseURL}`);
      return Promise.resolve(nodeConfigWithChainInfo);
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
      const blockchainInfo = await getBitcoinCoreNetworkConnectionInfo();
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
      const blockchainInfo = await getCustomNodeBlockchainInfo(
        currentNodeConfig
      );
      return Promise.resolve({
        ...blockchainInfo,
        provider: "Custom Node",
        baseURL: currentNodeConfig.baseURL,
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
    console.log(`error /rescanBlockchain ${e}`);
    return Promise.reject({ success: false, error: e });
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
    console.log(`error /getWalletInfo ${e}`);
    return Promise.reject({ success: false, error: e });
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
        const transaction = (await nodeClient.getRawTransaction(
          txId,
          true
        )) as FetchedRawTransaction;
        if (transaction.confirmations > 0) {
          return Promise.resolve(true);
        }
        throw new Error(`Transaction not confirmed (${txId})`);
      }
    } catch (e) {
      console.log(`error /isConfirmedTransaction ${e}`);
      return Promise.reject({ success: false, error: e });
    }
  }
  console.log(`error /isConfirmedTransaction: Invalid txId`);
  return Promise.reject({ success: false });
});
