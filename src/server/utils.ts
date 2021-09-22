import fs from "fs";
import readline from "readline";
import { Client, ClientOption } from "bitcoin-simple-rpc";
import { SocksProxyAgent } from "socks-proxy-agent";
import { Network } from "bitcoinjs-lib";
import { app, remote } from "electron";
import path from "path";

import { BitcoinCoreConfVariables } from "src/types";

export const saveFile = async (file: string, filename: string) => {
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

export const getFile = async (filename: string) => {
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

export const getBitcoinDirectory = () => {
  if (process.platform === "darwin") {
    return `${process.env.HOME}/Library/Application Support/Bitcoin`;
  } else if (process.platform === "win32") {
    return `${process.env.APPDATA}/Bitcoin`;
  } else {
    return `${process.env.HOME}/.bitcoin`;
  }
};

export const getRpcInfo = async () => {
  const bitcoinConfFileLocation = `${getBitcoinDirectory()}/bitcoin.conf`;
  if (fs.existsSync(bitcoinConfFileLocation)) {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(bitcoinConfFileLocation),
    });

    const config = {} as {
      [key: string]: string;
    };

    // turn key/value strings into object
    for await (const line of readInterface) {
      const trimmedLine = line.trim();
      if (trimmedLine.length && !trimmedLine.startsWith("#")) {
        const [key, value] = trimmedLine.split("=");
        if (key && value) {
          config[key] = value;
        }
      }
    }

    return {
      rpcuser: config.rpcuser,
      rpcpassword: config.rpcpassword,
      rpcport: config.rpcport,
    } as BitcoinCoreConfVariables;
  } else {
    console.log("No bitcoin.conf file found");
  }
};

export const getClientFromNodeConfig = (nodeConfig: ClientOption) => {
  if (nodeConfig.baseURL.includes(".onion")) {
    // is tor
    const proxyOptions = "socks5h://127.0.0.1:9050";
    const httpsAgent = new SocksProxyAgent(proxyOptions);
    return new Client({
      ...nodeConfig,
      httpAgent: httpsAgent,
    });
  } else {
    // local node, no tor
    return new Client(nodeConfig);
  }
};

export const sleep = async (time: number) =>
  await new Promise((r) => setTimeout(r, time));

export const getTxIdFromChannelPoint = (channelPoint: string) =>
  channelPoint.substr(0, channelPoint.indexOf(":"));

export const getErrorMessageFromChunk = (chunk: string) =>
  chunk.substring(chunk.indexOf("err=") + 4);

export const bitcoinNetworkEqual = (a: Network, b: Network) => {
  return a.bech32 === b.bech32;
};

export const getBitcoinCoreConfig = async () => {
  try {
    const rpcInfo = await getRpcInfo();
    // TODO: check for testnet
    if (rpcInfo) {
      try {
        const nodeConfig = {
          baseURL: "localhost",
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
};
