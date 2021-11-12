import { writeFile, readFileSync, statSync, existsSync, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { Client, ClientOption } from 'bitcoin-simple-rpc';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { join } from 'path';

import { BitcoinCoreConfVariables } from '@lily/types';

export const saveFile = async (file: string, filename: string, userDataPath: string) => {
  const filePath = join(userDataPath, filename);
  writeFile(filePath, file, (err) => {
    if (err) {
      return Promise.reject();
    }

    const fileContents = readFileSync(filePath);
    if (fileContents) {
      const stats = statSync(filePath);
      const mtime = stats.mtime;
      return Promise.resolve({
        file: fileContents.toString(),
        modifiedTime: mtime
      });
    } else {
      return Promise.reject();
    }
  });
};

export const getFile = async (filename: string, userDataPath: string) => {
  const filePath = join(userDataPath, filename);
  const fileContents = readFileSync(filePath);
  if (fileContents) {
    const stats = statSync(filePath);
    const mtime = stats.mtime;
    return Promise.resolve({
      file: fileContents.toString(),
      modifiedTime: mtime
    });
  } else {
    return Promise.reject();
  }
};

export const getBitcoinDirectory = () => {
  if (process.platform === 'darwin') {
    return `${process.env.HOME}/Library/Application Support/Bitcoin`;
  } else if (process.platform === 'win32') {
    return `${process.env.APPDATA}/Bitcoin`;
  } else {
    return `${process.env.HOME}/.bitcoin`;
  }
};

export const getRpcInfo = async () => {
  const bitcoinConfFileLocation = `${getBitcoinDirectory()}/bitcoin.conf`;
  if (existsSync(bitcoinConfFileLocation)) {
    const readInterface = createInterface({
      input: createReadStream(bitcoinConfFileLocation)
    });

    const config = {} as {
      [key: string]: string;
    };

    // turn key/value strings into object
    for await (const line of readInterface) {
      const trimmedLine = line.trim();
      if (trimmedLine.length && !trimmedLine.startsWith('#')) {
        const [key, value] = trimmedLine.split('=');
        if (key && value) {
          config[key] = value;
        }
      }
    }

    return {
      rpcuser: config.rpcuser,
      rpcpassword: config.rpcpassword,
      rpcport: config.rpcport
    } as BitcoinCoreConfVariables;
  } else {
    console.log('No bitcoin.conf file found');
  }
};

export const getClientFromNodeConfig = (nodeConfig: ClientOption) => {
  if (nodeConfig.baseURL.includes('.onion')) {
    // is tor
    const proxyOptions = 'socks5h://127.0.0.1:9050';
    const httpsAgent = new SocksProxyAgent(proxyOptions);
    return new Client({
      ...nodeConfig,
      httpAgent: httpsAgent
    });
  } else {
    // local node, no tor
    return new Client(nodeConfig);
  }
};

export const sleep = async (time: number) => await new Promise((r) => setTimeout(r, time));

export const getTxIdFromChannelPoint = (channelPoint: string) =>
  channelPoint.substr(0, channelPoint.indexOf(':'));

export const getErrorMessageFromChunk = (chunk: string) =>
  chunk.substring(chunk.indexOf('err=') + 4);

export const getBitcoinCoreConfig = async () => {
  try {
    const rpcInfo = await getRpcInfo();
    // TODO: check for testnet
    if (rpcInfo) {
      const nodeConfig = {
        baseURL: 'localhost',
        username: rpcInfo.rpcuser,
        password: rpcInfo.rpcpassword,
        port: rpcInfo.rpcport || '8332',
        version: '0.20.1'
      };
      return Promise.resolve(nodeConfig);
    }
    console.log('getBitcoinCoreConfig: No RPC Info found');
    return Promise.resolve({
      baseURL: 'localhost',
      username: undefined,
      password: undefined,
      port: '8332',
      version: '0.20.1'
    });
  } catch (e) {
    console.log('getBitcoinCoreConfig: No RPC Info found');
    return Promise.resolve({
      baseURL: 'localhost',
      username: undefined,
      password: undefined,
      port: '8332',
      version: '0.20.1'
    });
  }
};
