import { Network } from 'bitcoinjs-lib';
import { WalletInfo, ClientOption } from 'bitcoin-simple-rpc';
import type {
  Channel,
  PendingChannel,
  ChannelBalanceResponse,
  OpenStatusUpdate,
  ChannelCloseSummary,
  Payment,
  Invoice,
  CloseChannelRequest
} from '@lily-technologies/lnrpc';

import { blockchainTransaction_getBatchResponse, ElectrumVin } from '@mempool/electrum-client';

export interface ICallback<r> {
  (err: null, result: r): void;
  (err: Error, result?: r): void;
}

export const EMPTY_CONFIG: LilyConfig = {
  name: '',
  version: '1.0.8',
  isEmpty: true,
  wallets: [],
  vaults: [],
  lightning: []
};

export interface File {
  file: string;
  modifiedTime: number;
}

// id for account created using the createAccountId function
export type AccountId = string;

// id for account created using the createKeyId function
export type KeyId = string;

export type FeeRateOptions = 'fastestFee' | 'halfHourFee' | 'hourFee';

export type FeeRates = Record<'fastestFee' | 'halfHourFee' | 'hourFee', number>;
export interface CaravanConfig {
  name: string;
  network: 'mainnet' | 'testnet';
  addressType: AddressType;
  quorum: {
    requiredSigners: number;
    totalSigners: number;
  };
  startingAddressIndex: 0;
  extendedPublicKeys: {
    name: string;
    bip32Path: string;
    xpub: string;
    xfp: string;
  }[];
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

export interface ChangeNodeConfigParams {
  provider: NodeConfigWithBlockchainInfo['provider'];
  host?: string;
  port?: string;
}

export interface BitcoinCoreNodeConfig extends ClientOption {
  provider: 'Bitcoin Core';
}

export interface EsploraNodeConfig {
  provider: 'Esplora';
}

export interface ElectrumNodeConfig {
  provider: 'Electrum';
}

export interface OnchainProviderConnectionDetails {
  url: string;
  port?: number;
  protocol?: 'tcp' | 'ssl';
}

export interface NodeConfigWithBlockchainInfo {
  provider:
    | BitcoinCoreNodeConfig['provider']
    | EsploraNodeConfig['provider']
    | ElectrumNodeConfig['provider'];
  connectionDetails: OnchainProviderConnectionDetails;
  connected: boolean;
  initialblockdownload?: boolean;
  verificationprogress?: number;
  blocks: number;
}

export type InputOrOutput = Vin | Vout;

export interface Vin {
  txid: string;
  vout: number;
  prevout: Vout;
  scriptsig?: string;
  scriptsig_asm?: string;
  witness: string[];
  is_coinbase?: boolean;
  sequence: number;
  isChange?: boolean;
  isMine?: boolean;
}

export interface Vout {
  scriptpubkey?: string;
  scriptpubkey_asm?: string;
  scriptpubkey_type?: string;
  scriptpubkey_address: string;
  value: number;
  isChange?: boolean;
  isMine?: boolean;
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

export type TransactionType = 'sent' | 'received' | 'moved';

export enum LicenseTiers {
  basic = 'basic',
  premium = 'premium'
}

export enum LicenseResponseTiers {
  basicThree = 'basicThree',
  basicFive = 'basicFive',
  premium = 'premium'
}

export interface Transaction extends EsploraTransactionResponse {
  type: TransactionType;
  totalValue: number;
  address: string;
  value: number;
}

export interface DecoratedLightningChannel extends Channel {
  alias: string;
  lastUpdate: number;
}

export interface DecoratedPendingLightningChannel extends PendingChannel {
  alias: string;
}

export interface DecoratedOpenStatusUpdate extends OpenStatusUpdate {
  alias: string;
}

export interface LilyCloseChannelRequest extends CloseChannelRequest {
  lndConnectUri: string;
}

// either channel open/close, or send/receive payment
export interface LightningEvent {
  type: 'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'PAYMENT_SEND' | 'PAYMENT_RECEIVE';
  creationDate?: string;
  title: string;
  valueSat: string;
  tx?: Transaction;
  channel?: Channel;
}

export interface OpenChannelRequestArgs {
  lightningAddress: string;
  channelAmount: string;
}

export interface GenerateLightningInvoiceRequest {
  memo: string;
  value: string;
  lndConnectUri: string;
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
  loading: boolean | WalletInfo['scanning'];
}

export interface LightningConfig {
  id: string;
  type: 'lightning';
  created_at: number;
  name: string;
  network: 'mainnet' | 'testnet';
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
  channels: DecoratedLightningChannel[];
  pendingChannels: DecoratedPendingLightningChannel[];
  closedChannels: ChannelCloseSummary[];
  info: any;
  events: LightningEvent[];
  payments: Payment[];
  invoices: Invoice[];
  currentBalance: ChannelBalanceResponse;
  balanceHistory: BalanceHistory[];
  loading: boolean | WalletInfo['scanning'];
}

export interface BalanceHistory {
  blockTime?: number;
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
  version: '1.0.8';
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: VaultConfig[];
  lightning: LightningConfig[];
}

export interface LilyConfigOneDotSevenConfig {
  name: string;
  version: '1.0.7';
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: VaultConfig[];
}

export interface LilyConfigOneDotFiveConfig {
  name: string;
  version: '1.0.5';
  license: LilyLicense;
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: OnChainConfig[];
}

export interface LilyConfigOneDotZeroConfig {
  name: string;
  version: '1.0.0';
  license: LilyLicense;
  isEmpty: boolean;
  wallets: OnChainConfig[];
  vaults: OnChainConfig[];
}

export interface LilyZeroDotOneConfig {
  name: string;
  version: '0.0.1' | '0.0.2';
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
    | 'coldcard'
    | 'trezor'
    | 'ledger'
    | 'phone'
    | 'lily'
    | 'cobo'
    | 'bitbox02'
    | 'unchained'
    | 'unknown';
  fingerprint: string;
  model: string; // KBC-TODO: get more specific with this
  owner?: {
    name?: string;
    email?: string;
  };
}

export interface HwiEnumerateResponse {
  // device responses from HWI
  type: Device['type'];
  model: string; // KBC-TODO: get more specific with this
  path: string;
  fingerprint: string;
  // xpub: string;
}

export interface HwiEnumerateWithXpubResponse extends HwiEnumerateResponse {
  xpub: string;
}

export interface HwiXpubRequest {
  deviceType: HwiEnumerateResponse['type'];
  devicePath: HwiEnumerateResponse['path'];
  path: string;
}

export interface HwiXpubResponse {
  xpub: string;
}

export interface HwiSignTransactionRequest {
  deviceType: HwiEnumerateResponse['type'];
  devicePath: HwiEnumerateResponse['path'];
  psbt: string;
}

export interface HwiSignTransactionResponse {
  psbt: string;
}

export interface HwiPromptPinRequest {
  deviceType: HwiEnumerateResponse['type'];
  devicePath: HwiEnumerateResponse['path'];
}

export interface HwiPromptPinResponse {
  error?: string;
}

export interface HwiSendPinRequest {
  deviceType: HwiEnumerateResponse['type'];
  devicePath: HwiEnumerateResponse['path'];
  pin: string;
}

export interface HwiSendPinResponse {
  success: boolean;
}

export interface ExtendedPublicKey {
  id: KeyId;
  created_at: number;
  parentFingerprint: string;
  network: 'mainnet' | 'testnet';
  bip32Path: string;
  xpub: string;
  device: Device;
}

export enum AddressType {
  P2WSH = 'P2WSH',
  P2WPKH = 'P2WPKH',
  p2sh = 'p2sh',
  multisig = 'multisig'
}

export interface OnChainConfig {
  id: AccountId;
  type: 'onchain';
  created_at: number;
  name: string;
  network: 'mainnet' | 'testnet';
  addressType: AddressType;
  quorum: {
    requiredSigners: number;
    totalSigners: number;
  };
  extendedPublicKeys: ExtendedPublicKey[];
  mnemonic?: string;
  parentFingerprint?: string;
}

export type OnChainConfigWithoutId = Omit<OnChainConfig, 'id'>;

export interface GetOnchainDataResponse {
  addresses: Address[];
  changeAddresses: Address[];
  transactions: Transaction[];
  unusedAddresses: Address[];
  unusedChangeAddresses: Address[];
  availableUtxos: UTXO[];
}

export interface VaultConfig extends OnChainConfig {
  license: LilyLicense;
}

export interface Bip32Derivation {
  masterFingerprint: string;
  pubkey: string;
  path: string;
}

export interface PubKey {
  childPubKey: string;
  bip32derivation: Bip32Derivation;
}

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

export type ColdcardMultisigExportFile = ColdcardMultisigItem & {
  seed_version: number;
  use_encryption: boolean;
  wallet_type: string; // "2of3"
};

interface ColdcardMultisigItem {
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
export interface ShoppingItem {
  image: any;
  header: string;
  subtext: string;
  extraInfo?: ExtraInfo[];
}

interface ExtraInfo {
  label: string;
  value: string;
}

export interface BitcoinCoreConfVariables {
  rpcuser: string;
  rpcpassword: string;
  rpcport: string;
}

interface ElectrumVinWithPrevout extends ElectrumVin {
  prevout: {
    scriptpubkey_address: string;
    value: number;
  };
}
export interface ElectrumTxToEsploraTx extends blockchainTransaction_getBatchResponse {
  vin: ElectrumVinWithPrevout[];
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

export interface EsploraTransactionResponse {
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
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

export interface CoindeskHistoricPriceResponse {
  bpi: { [date: string]: number };
  disclaimer: string;
  time: {
    updated: string;
    updatedISO: string;
  };
}

export interface PriceForChart {
  price: [price: number];
  date: string;
}

export interface CoindeskCurrentPriceResponse {
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
  disclaimer: string;
  chartName: 'Bitcoin';
  bpi: {
    [currency: string]: {
      code: string;
      symbol: string;
      rate: string;
      description: string;
      rate_float: number;
    };
  };
}
