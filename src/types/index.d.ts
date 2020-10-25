declare global {
  interface Window {
    ipcRenderer: any;
  }
}

export interface File {
  file: string,
  modifiedTime: number
}

export interface NodeConfig {
  provider: string,
  connected: boolean,
  username: string,
  password: string,
  port: string,
  version: string
}

export interface Transaction {
  txid: string
}

export interface Account {
  name: string
  config: {
    name: string
  }
  transactions: Transaction[]
  loading: boolean
}

export interface AccountMap {
  [id: string]: Account
}

export interface Config {
  name: string,
  version: string,
  isEmpty: boolean,
  backup_options: {
    gDrive: boolean
  },
  wallets: any[], // TODO: change
  vaults: any[], // TODO: change
  keys: any[], // TODO: change
  exchanges: any[] // TODO: change
}