import { ACCOUNTMAP_SET, ACCOUNTMAP_UPDATE } from '../reducers/accountMap'

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

export type InputOrOutput = Vin | Vout;

export interface Vin {
  txid: string
  vout: number
  prevout: Vout
  scriptsig: string
  scriptsig_asm: string
  witness: string[]
  is_coinbase: boolean
  sequence: number
  isChange: boolean
  isMine: boolean
}

export interface Vout {
  scriptpubkey: string
  scriptpubkey_asm: string
  scriptpubkey_type: string
  scriptpubkey_address: string
  value: number
  isChange: boolean
  isMine: boolean
}

export enum TransactionType {
  sent = 'sent',
  received = 'recieved',
  moved = 'moved'
}

export interface Transaction {
  txid: string
  version: number,
  locktime: number,
  vin: Vin[],
  vout: Vout[]
  size: number,
  weight: number,
  fee: number,
  status: {
    confirmed: boolean,
    block_height?: number,
    block_hash?: string,
    block_time: number
  }
  type: TransactionType,
  totalValue: number,
  address: string,
  value: number,
  blockheight: number // bitcoin-core doesn't format the same
}

export interface TransactionMap {
  [id: string]: Transaction
}

export interface TxStatus {
  confirmed: boolean,
  block_height?: number,
  block_hash?: string,
  block_time?: number
}

export interface Address {
  network: Network,
  address?: string,
  hash?: Buffer,
  output: any
  redeem: any
  input: any
  witness: any
  isChange?: boolean
  isMine?: boolean
  bip32derivation: any[] // TODO: change
}

export interface UTXO {
  txid: string,
  vout: number,
  status: TxStatus,
  value: number,
  address: Address | string // string if from bitcoin-core
  amount?: number // comes from bitcoin-core node
}

export interface LilyAccount {
  name: string
  config: AccountConfig
  addresses?: Address[]
  changeAddresses?: Address[]
  availableUtxos?: UTXO[]
  transactions: Transaction[]
  unusedAddresses?: Address[]
  unusedChangeAddresses?: Address[]
  currentBalance: number
  loading: boolean
}

export interface AccountMap {
  [id: string]: LilyAccount
}

export interface AddressMap {
  [id: string]: Address
}

export interface LilyConfig {
  name: string,
  version: string,
  isEmpty: boolean,
  backup_options: {
    gDrive: boolean
  },
  wallets: AccountConfig[],
  vaults: AccountConfig[],
  keys: any[], // TODO: change
  exchanges: any[] // TODO: change
}

export interface Device {
  type: 'coldcard' | 'trezor' | 'ledger' | 'phone'
  fingerprint: string
  model: string
}

export interface ExtendedPublicKey {
  id: string,
  created_at: number,
  parentFingerprint: string,
  network: 'mainnet' | 'testnet',
  bip32Path: string,
  xpub: string,
  device: Device
}

export enum AddressType {
  P2WSH = 'P2WSH',
  P2WPKH = 'P2WPKH',
  p2sh = 'p2sh',
  multisig = 'multisig'
}

export interface AccountConfig {
  id: string
  created_at: number
  name: string
  network: 'mainnet' | 'testnet'
  addressType: AddressType
  quorum: {
    requiredSigners: number
    totalSigners: number
  },
  extendedPublicKeys?: ExtendedPublicKey[]
  device?: Device
  xpub?: string
  parentFingerprint?: string
}

export interface PubKey {
  childPubKey: string
  bip32derivation: {
    masterFingerprint: Buffer
    pubkey: Buffer
    path: string
  }
}

export type AccountMapAction =
  | { type: ACCOUNTMAP_UPDATE, payload: { account: LilyAccount } }
  | { type: ACCOUNTMAP_SET, payload: AccountMap };