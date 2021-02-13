import { Network, Psbt } from "bitcoinjs-lib";
import { ACCOUNTMAP_SET, ACCOUNTMAP_UPDATE } from "../reducers/accountMap";
import { WalletInfo } from "bitcoin-simple-rpc";

declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      ipcRenderer: any;
      ipcMain: any;
    }
  }
  interface Window {
    ipcRenderer: any;
  }
}

// React Types
export type SetStateBoolean = React.Dispatch<React.SetStateAction<boolean>>;
export type SetStateString = React.Dispatch<React.SetStateAction<string>>;
export type SetStateNumber = React.Dispatch<React.SetStateAction<number>>;
export type SetStatePsbt = React.Dispatch<React.SetStateAction<Psbt>>;

export interface File {
  file: string;
  modifiedTime: number;
}

export interface FeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
}
export interface CaravanConfig {
  client: any; // KBC-TODO: allow private connection to node
  id: string;
  created_at: number;
  name: string;
  network: "mainnet" | "testnet";
  addressType: AddressType;
  quorum: {
    requiredSigners: number;
    totalSigners: number;
  };
  extendedPublicKeys?: {
    id: string;
    name: string;
    method: string;
    created_at: number;
    parentFingerprint: string;
    network: "mainnet" | "testnet";
    bip32Path: string;
    xpub: string;
    device: Device;
  }[];
  device?: Device;
  xpub?: string;
  mnemonic?: string;
  parentFingerprint?: string;
}

export interface NodeConfig {
  provider: string;
  baseURL: string;
  connected: boolean;
  username: string;
  password: string;
  port: string;
  version: string;
  initialblockdownload?: boolean;
  verificationprogress?: number;
  blocks: number;
}

export type InputOrOutput = Vin | Vout;

export interface Vin {
  txid: string;
  vout: number;
  prevout: Vout;
  scriptsig: string;
  scriptsig_asm: string;
  witness: string[];
  is_coinbase: boolean;
  sequence: number;
  isChange: boolean;
  isMine: boolean;
}

export interface Vout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
  isChange: boolean;
  isMine: boolean;
}

export interface PsbtInput {
  hash: string;
  index: number;
  sequence: number;
  nonWitnessUtxo: Buffer;
  witnessScript?: Buffer;
  redeemScript?: Buffer;
  bip32Derivation: Bip32Derivation[];
}

export enum TransactionType {
  sent = "sent",
  received = "received",
  moved = "moved",
}

export enum LicenseTiers {
  free = "free",
  basic = "basic",
  essential = "essential",
  premium = "premium",
}

export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time: number;
  };
  type: TransactionType;
  totalValue: number;
  address: string;
  value: number;
}

export interface TransactionMap {
  [id: string]: Transaction;
}

export interface TxStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

export interface Address {
  network: Network;
  address: string;
  hash?: Buffer;
  output: any;
  redeem: any;
  input?: any;
  witness?: any;
  isChange?: boolean;
  isMine?: boolean;
  bip32derivation: Bip32Derivation[];
}

export interface UTXO {
  txid: string;
  vout: number;
  status: TxStatus;
  value: number;
  address: Address;
  amount?: number; // comes from bitcoin-core node
  prevTxHex: string; // added to UTXO when retriving for Trezor HWW
}

export interface LilyAccount {
  name: string;
  config: AccountConfig;
  addresses: Address[];
  changeAddresses: Address[];
  availableUtxos: UTXO[];
  transactions: Transaction[];
  unusedAddresses: Address[];
  unusedChangeAddresses: Address[];
  currentBalance: number;
  loading: boolean | WalletInfo.scanning;
}

export interface AccountMap {
  [id: string]: LilyAccount;
}

export interface AddressMap {
  [id: string]: Address;
}

export interface UtxoMap {
  [id: string]: UTXO;
}

export interface PaymentAddressResponse {
  childPath: string;
  address: string;
  basic: number;
  essential: number;
  premium: number;
}
export interface LicenseResponse {
  license: string;
  signature: string;
}
export interface LilyLicense {
  license: string;
  signature: string;
}
export interface LilyConfig {
  name: string;
  version: string;
  license: LilyLicense;
  isEmpty: boolean;
  wallets: AccountConfig[];
  vaults: AccountConfig[];
  keys: any[]; // TODO: change
  exchanges: any[]; // TODO: change
}

export interface OldLilyConfig {
  name: string;
  version: string;
  isEmpty: boolean;
  backup_options: {
    gDrive: boolean;
  };
  wallets: {
    id: string;
    created_at: number;
    name: string;
    network: string;
    addressType: string;
    quorum: {
      requiredSigners: number;
      totalSigners: number;
    };
    xpub: string;
    parentFingerprint: string;
    device: Device;
    mnemonic?: string;
  }[];
  vaults: AccountConfig[];
  keys: any[]; // TODO: change
  exchanges: any[]; // TODO: change
}

export interface Device {
  type: "coldcard" | "trezor" | "ledger" | "phone" | "lily" | "cobo";
  fingerprint: string;
  model: string; // KBC-TODO: get more specific with this
}

export interface HwiResponseEnumerate {
  // device responses from HWI
  type: Device["type"];
  model: string; // KBC-TODO: get more specific with this
  path: string;
  fingerprint: string;
  xpub: string;
}

export interface ExtendedPublicKey {
  id: string;
  created_at: number;
  parentFingerprint: string;
  network: "mainnet" | "testnet";
  bip32Path: string;
  xpub: string;
  device: Device;
}

export enum AddressType {
  P2WSH = "P2WSH",
  P2WPKH = "P2WPKH",
  p2sh = "p2sh",
  multisig = "multisig",
}

export interface AccountConfig {
  id: string;
  created_at: number;
  name: string;
  network: "mainnet" | "testnet";
  addressType: AddressType;
  quorum: {
    requiredSigners: number;
    totalSigners: number;
  };
  extendedPublicKeys: ExtendedPublicKey[];
  mnemonic?: string;
  parentFingerprint?: string;
}

export interface Bip32Derivation {
  masterFingerprint: Buffer;
  pubkey: Buffer;
  path: string;
}

export interface PubKey {
  childPubKey: string;
  bip32derivation: Bip32Derivation;
}

export type AccountMapAction =
  | { type: ACCOUNTMAP_UPDATE; payload: { account: LilyAccount } }
  | { type: ACCOUNTMAP_SET; payload: AccountMap };

export interface ColdcardElectrumExport {
  keystore: {
    ckcc_xpub: string; // xpub661MyMwAqRbcFY3rShdoE89xuc8g3ZkKbfVT7t3DPpomRASfjeWMbYSTTnxUTXcTdu73MEZCXmzv8ravVjvq8aC9jM4ZaM1BiD46
    xpub: string; // ypub6X1iLoC66mvtA1zigXwTSbLrFpBp9idkscgb9GBcPryy3vn52QtumoJwA9ykpJy5oAQEuPCuRYvxz9qjymDiucZ5fgEwNAeBMB
    label: string; // Coldcard Import 4F60D1C9
    ckcc_xfp: number; // 3385942095
    type: string; // hardware
    hw_type: string; // coldcard
    derivation: string; // m/49'/0'/0'
  };
  wallet_type: string; // standard
  use_encryption: boolean; // false
  seed_version: number; // 17
}

export interface ColdcardDeviceMultisigExportFile {
  p2sh_deriv: string; // m/45'
  p2sh: string; // xpub68ULYdfaSbytWGGNnutbcDLVyk3hyi3Tv5A8eftKDumTwTbRcT8u4QvZAWHRtqKMPb8serYEokayLLbicvwrar6TF1afmn3637v1Q6T2ZD
  p2wsh_p2sh_deriv: string; // m/48'/0'/0'/1'
  p2wsh_p2sh: string; // Ypub6kmiukr9rKYGxbifxWJpJP3LALmaFHuxjokuucps9daff1xXysKDaAduo3lkiDsUZf9VjEGPrvHUSz1fJJ4QWRnNjDcjxdsUG9qeQXG9Xiz
  p2wsh_deriv: string; // m/48'/0'/0'/2'
  p2wsh: string; // Zpub7kiyeVX5115krPgvUjigApgRHHbj7tMjaizGTg3WUQbzkpcckp5UFfeX6klo9qRQkRsCdd3ck14aa7Bh8UJoUPN1dmVTZdWNDythNZXJ5dY
  xfp: string; // 4F60D1C
}

export interface ColdcardMultisigExportFile {
  seed_version: number;
  use_encryption: boolean;
  wallet_type: string; // "2of3"
  [index: string]: {
    xpub: string; // Zpub75sdfasdtbXgj2YXAq6KUpQddsuQ9777w7pjlknbndP6UoseZNLHy1B561vHNmKQ5SqJ24HmoFCNrTRV4dfasdfadfGt3NF5TyR2ZCfeCZcT7HSHUN
    hw_type: string; // "coldcard",
    ckcc_xfp: number; // 3618723177,
    label: string; // "Coldcard 919dxC3D6",
    derivation: string; // "m/48'/0'/0'/2'",
    type: string; //"hardware"
  };
}

export interface BitcoinCoreGetTransactionResponse {
  amount: number;
  fee: number;
  confirmations: number;
  blockhash: string;
  blockheight: number;
  blockindex: number;
  blocktime: number;
  txid: string;
  walletconflicts: [];
  time: number;
  timereceived: number;
  // bip125-replaceable: "yes" | "no",
  details: [
    {
      involvesWatchonly: boolean;
      address: string;
      category: string; // "send", "recieve"
      amount: number;
      vout: number;
      fee: number;
      abandoned: boolean;
    }
  ];
  hex: string;
  decoded: {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    locktime: number;
    vin: [
      {
        txid: string;
        vout: number;
        scriptSig: {
          asm: string;
          hex: string;
        };
        txinwitness: string[];
        sequence: number;
      }
    ];
    vout: [
      {
        value: number;
        n: number;
        scriptPubKey: {
          asm: string;
          hex: string;
          reqSigs: number;
          type: string;
          addresses: string[];
        };
      }
    ];
  };
}

export interface BitcoinCoreGetRawTransactionResponse {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: [
    {
      txid: string;
      vout: number;
      scriptSig: {
        asm: string;
        hex: string;
      };
      txinwitness: string[];
      sequence: number;
    }
  ];
  vout: [
    {
      value: number;
      n: number;
      scriptPubKey: {
        asm: string;
        hex: string;
        reqSigs: number;
        type: string;
        addresses: string[];
      };
    }
  ];
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
}
