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

// see https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

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

export type TransactionType = "sent" | "received" | "moved";

export enum LicenseTiers {
  basic = "basic",
  premium = "premium",
}

export enum LicenseResponseTiers {
  basicThree = "basicThree",
  basicFive = "basicFive",
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

export interface LightningChannel {
  pending_htlcs: HTLC[];
  alias: string; // added via main.js
  last_update: number; // added via main.js
  active: boolean;
  remote_pubkey: string;
  channel_point: string;
  chan_id: number;
  capacity: number;
  local_balance: number;
  remote_balance: number;
  commit_fee: number;
  commit_weight: number;
  fee_per_kw: number;
  unsettled_balance: number;
  total_satoshis_sent: number;
  total_satoshis_received: number;
  num_updates: number;
  csv_delay: number;
  private: boolean;
  initiator: boolean;
  chan_status_flags: string;
  local_chan_reserve_sat: number;
  remote_chan_reserve_sat: number;
  static_remote_key: boolean;
  lifetime: number;
  uptime: number;
  close_address: "";
  commitment_type:
    | "LEGACY"
    | "STATIC_REMOTE_KEY"
    | "ANCHORS"
    | "UNKNOWN_COMMITMENT_TYPE";
  push_amount_sat: number;
  thaw_height: number;
  local_constraints: {
    csv_delay: number;
    chan_reserve_sat: number;
    dust_limit_sat: number;
    max_pending_amt_msat: number;
    min_htlc_msat: number;
    max_accepted_htlcs: number;
  };
  remote_constraints: {
    csv_delay: number;
    chan_reserve_sat: number;
    dust_limit_sat: number;
    max_pending_amt_msat: number;
    min_htlc_msat: number;
    max_accepted_htlcs: number;
  };
}

type Initiator =
  | "INITIATOR_UNKNOWN"
  | "INITIATOR_LOCAL"
  | "INITIATOR_REMOTE"
  | "INITIATOR_BOTH";

export interface ClosedLightningChannel {
  capacity: number;
  chain_hash: string;
  chan_id: number;
  channel_point: string;
  close_height: number;
  close_initiator: Initiator;
  close_type:
    | "COOPERATIVE_CLOSE"
    | "LOCAL_FORCE_CLOSE"
    | "REMOTE_FORCE_CLOSE"
    | "BREACH_CLOSE"
    | "FUNDING_CANCELED"
    | "ABANDONED";
  closing_tx_hash: string;
  open_initiator: Initiator;
  remote_pubkey: string;
  resolutions: any[];
  settled_balance: number;
  time_locked_balance: number;
}

export interface LightningTransaction {
  dest_addresses: string[];
  tx_hash: string;
  amount: number;
  num_confirmations: number;
  block_hash: string;
  block_height: number;
  time_stamp: number;
  total_fees: number;
  raw_tx_hex: string;
  label: string;
}

export interface LightningPayment {
  htlcs: HTLC[];
  payment_hash: string;
  value: number;
  creation_date: number;
  fee: number;
  payment_preimage: string;
  value_sat: number;
  value_msat: number;
  payment_request: string;
  status: string;
  fee_sat: number;
  fee_msat: number;
  creation_time_ns: number;
  payment_index: number;
  failure_reason: string;
}

export interface LightningInvoice {
  route_hints: any[];
  htlcs: HTLC[];
  features: any[];
  memo: string;
  r_preimage: Buffer;
  r_hash: Buffer;
  value: number;
  settled: boolean;
  creation_date: number;
  settle_date: number;
  payment_request: string;
  description_hash: Buffer;
  expiry: number;
  fallback_addr: string;
  cltv_expiry: number;
  private: boolean;
  add_index: number;
  settle_index: number;
  amt_paid: number;
  amt_paid_sat: number;
  amt_paid_msat: number;
  state: "SETTLED" | "CANCELED";
  value_msat: number;
  is_keysend: number;
  payment_addr: Buffer;
  is_amp: boolean;
}

export type LightningActivity =
  | "CHANNEL_OPEN"
  | "CHANNEL_CLOSE"
  | "PAYMENT_SEND"
  | "PAYMENT_RECEIVE";

// either channel open/close, or send/receive payment
export interface LightningEvent {
  type: LightningActivity;
  creation_date: number;
  title: string;
  value_sat: number;
  tx?: Transaction;
  channel?: ClosedLightningChannel;
}

export interface HTLC {
  status: "SUCCEEDED" | "IN_FLIGHT" | "FAILED";
  route: any;
  attempt_time_ns: number;
  resolve_time_ns: number;
  failure: any;
  preimage: Buffer;
  attempt_id: number;
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
  redeem?: any;
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

export interface LilyOnchainAccount {
  name: string;
  config: OnChainConfig;
  addresses: Address[];
  changeAddresses: Address[];
  availableUtxos: UTXO[];
  transactions: Transaction[];
  unusedAddresses: Address[];
  unusedChangeAddresses: Address[];
  currentBalance: number;
  loading: boolean | WalletInfo.scanning;
}

export interface LightningConfig {
  id: string;
  type: "lightning";
  created_at: number;
  name: string;
  network: "mainnet" | "testnet";
  connectionDetails: {
    lndConnectUri: string;
  };
}

export interface LightningBalance {
  local_balance: LightningAmount;
  remote_balance: LightningAmount;
  unsettled_local_balance: LightningAmount;
  unsettled_remote_balance: LightningAmount;
  pending_local_balance: LightningAmount;
  pending_remote_balance: LightningAmount;
}

export interface LightningAmount {
  sat: number;
  msat: number;
}

export interface LilyLightningAccount {
  name: string;
  config: LightningConfig;
  channels: LightningChannel[];
  pendingChannels: LightningChannel[];
  closedChannels: ClosedLightningChannel[];
  info: any;
  events: LightningEvent[];
  payments: LightningPayment[];
  invoices: LightningInvoice[];
  currentBalance: LightningBalance;
  balanceHistory: BalanceHistory[];
  loading: boolean | WalletInfo.scanning;
}

export interface BalanceHistory {
  block_time: number;
  totalValue: number;
}

export type LilyAccount = LilyOnchainAccount | LilyLightningAccount;

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
  basicThree: number;
  basicFive: number;
  premium: number;
}
export interface LilyLicense {
  license: string;
  signature: string;
}
export interface LilyConfig {
  name: string;
  version: "1.0.8";
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: VaultConfig[];
  lightning: LightningConfig[];
}

export interface LilyConfigOneDotSevenConfig {
  name: string;
  version: "1.0.7";
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: VaultConfig[];
}

export interface LilyConfigOneDotFiveConfig {
  name: string;
  version: "1.0.5";
  license: LilyLicense;
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: OnChainConfig[];
}

export interface LilyConfigOneDotZeroConfig {
  name: string;
  version: "1.0.0";
  license: LilyLicense;
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: OnChainConfig[];
}

export interface LilyZeroDotOneConfig {
  name: string;
  version: "0.0.1" | "0.0.2";
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
  vaults: OnChainConfig[];
  keys: any[]; // TODO: change
  exchanges: any[]; // TODO: change
}

export interface Device {
  type:
    | "coldcard"
    | "trezor"
    | "ledger"
    | "phone"
    | "lily"
    | "cobo"
    | "bitbox02";
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

export interface OnChainConfig {
  id: string;
  type: "onchain";
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

export interface VaultConfig extends OnChainConfig {
  license: LilyLicense;
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

// Shopping cart types
interface ShoppingItem {
  image: any;
  title: string;
  price: number;
  extraInfo?: ExtraInfo[];
}

interface ExtraInfo {
  label: string;
  value: string;
}
