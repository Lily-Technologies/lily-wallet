import {
  File,
  VaultConfig,
  OnChainConfig,
  LightningConfig,
  LilyAccount,
  LilyLightningAccount,
  LilyOnchainAccount,
  NodeConfig,
  PriceForChart,
  HwiRequestXpub,
  HwiResponseXpub,
  HwiRequestSignTransaction,
  HwiResponseSignTransaction,
  HwiResponseEnumerate,
  HwiRequestPromptPin,
  HwiResponsePromptPin,
  HwiRequestSendPin,
  HwiResponseSendPin,
  FeeRates,
  ChangeNodeConfigParams,
  NodeConfigWithBlockchainInfo,
  OpenChannelRequest,
  DecoratedOpenStatusUpdate,
  GetLightningInvoiceRequest
} from 'src/types';

import {
  Payment,
  CloseStatusUpdate,
  AddInvoiceResponse,
  CloseChannelRequest,
  FundingPsbtVerify,
  FundingPsbtFinalize
} from '@radar/lnrpc';

import { WalletInfo } from 'bitcoin-simple-rpc';

export type Platform = 'Electron' | 'Web';

export interface PlatformInterface {
  quit(): void;
  getConfig: () => Promise<File>;
  saveConfig(encryptedConfigObject: string): void;
  downloadFile(file: string, filename: string): void;

  getOnchainData(
    config: VaultConfig | OnChainConfig,
    callback?: (accountInfo: LilyAccount) => void
  ): void;
  getLightningData(
    config: LightningConfig,
    callback?: (accountInfo: LilyLightningAccount) => void
  ): void;

  getNodeConfig(): Promise<NodeConfig>;
  isTestnet(): Promise<boolean>;
  getHistoricalBitcoinPrice(): Promise<PriceForChart[]>;

  getCurrentBitcoinPrice(): Promise<string>;
  isConfirmedTransaction(txId: string): Promise<boolean>;

  getXpub({ deviceType, devicePath, path }: HwiRequestXpub): Promise<HwiResponseXpub>;
  enumerate(): Promise<HwiResponseEnumerate[]>;

  promptPin({ deviceType, devicePath }: HwiRequestPromptPin): Promise<HwiResponsePromptPin>;
  sendPin({ deviceType, devicePath, pin }: HwiRequestSendPin): Promise<HwiResponseSendPin>;
  estimateFee(): Promise<FeeRates>;
  changeNodeConfig({
    provider,
    host,
    username,
    password
  }: ChangeNodeConfigParams): Promise<NodeConfigWithBlockchainInfo>;
  broadcastTransaction(txHex: string): Promise<string>;

  sendLightningPayment(
    paymentRequest: string,
    config: LightningConfig,
    callback: (payment: Payment) => void
  ): void;

  closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (response: CloseStatusUpdate) => void
  ): void;

  openChannelInitiate(
    { lightningAddress, channelAmount }: OpenChannelRequest,
    callback: (response: DecoratedOpenStatusUpdate) => void
  ): void;

  openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify): void;
  openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize): void;
  getLightningInvoice({
    memo,
    value,
    lndConnectUri
  }: GetLightningInvoiceRequest): Promise<AddInvoiceResponse>;

  lightningConnect(lndConnectUri: string): void;

  rescanBlockchain(
    startHeight: string,
    currentAccount: LilyOnchainAccount
  ): Promise<{ success: boolean }>;

  getWalletInfo(currentAccount: LilyAccount): Promise<WalletInfo>;
}

export abstract class BasePlatform implements PlatformInterface {
  platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  abstract quit(): void;

  setPlatform(name: Platform) {
    this.platform = name;
  }

  abstract getConfig(): Promise<File>;

  abstract saveConfig(encryptedConfigObject: string): void;

  abstract downloadFile(file: string, filename: string): void;

  abstract getOnchainData(
    config: VaultConfig | OnChainConfig,
    callback?: (accountInfo: LilyOnchainAccount) => void
  ): void;

  abstract getLightningData(
    config: LightningConfig,
    callback?: (accountInfo: LilyLightningAccount) => void
  ): void;

  abstract getNodeConfig(): Promise<NodeConfig>;

  abstract isTestnet(): Promise<boolean>;

  abstract getHistoricalBitcoinPrice(): Promise<PriceForChart[]>;

  abstract getCurrentBitcoinPrice(): Promise<string>;

  abstract isConfirmedTransaction(txId: string): Promise<boolean>;

  abstract getXpub({ deviceType, devicePath, path }: HwiRequestXpub): Promise<HwiResponseXpub>;

  abstract signTransaction({
    deviceType,
    devicePath,
    psbt
  }: HwiRequestSignTransaction): Promise<HwiResponseSignTransaction>;

  abstract enumerate(): Promise<HwiResponseEnumerate[]>;

  abstract promptPin({
    deviceType,
    devicePath
  }: HwiRequestPromptPin): Promise<HwiResponsePromptPin>;

  abstract sendPin({ deviceType, devicePath, pin }: HwiRequestSendPin): Promise<HwiResponseSendPin>;

  abstract estimateFee(): Promise<FeeRates>;

  abstract changeNodeConfig({
    provider,
    host,
    username,
    password
  }: ChangeNodeConfigParams): Promise<NodeConfigWithBlockchainInfo>;

  abstract broadcastTransaction(txHex: string): Promise<string>;

  abstract sendLightningPayment(
    paymentRequest: string,
    config: LightningConfig,
    callback: (payment: Payment) => void
  ): void;

  abstract closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (response: CloseStatusUpdate) => void
  ): void;

  abstract openChannelInitiate(
    { lightningAddress, channelAmount }: OpenChannelRequest,
    callback: (response: DecoratedOpenStatusUpdate) => void
  ): void;

  abstract openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify): void;

  abstract openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize): void;

  abstract getLightningInvoice({
    memo,
    value,
    lndConnectUri
  }: GetLightningInvoiceRequest): Promise<AddInvoiceResponse>;

  abstract lightningConnect(lndConnectUri: string): void;

  abstract rescanBlockchain(
    startHeight: string,
    currentAccount: LilyAccount
  ): Promise<{ success: boolean }>;

  abstract getWalletInfo(currentAccount: LilyAccount): Promise<WalletInfo>;
}
