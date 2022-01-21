import type {
  Payment,
  CloseStatusUpdate,
  AddInvoiceResponse,
  CloseChannelRequest,
  FundingPsbtVerify,
  FundingPsbtFinalize,
  LookupInvoiceMsg,
  Invoice
} from '@lily-technologies/lnrpc';

import { WalletInfo } from 'bitcoin-simple-rpc';

import {
  ICallback,
  File,
  VaultConfig,
  OnChainConfig,
  LightningConfig,
  LilyAccount,
  LilyLightningAccount,
  LilyOnchainAccount,
  PriceForChart,
  HwiXpubRequest,
  HwiXpubResponse,
  HwiSignTransactionRequest,
  HwiSignTransactionResponse,
  HwiEnumerateResponse,
  HwiPromptPinRequest,
  HwiPromptPinResponse,
  HwiSendPinRequest,
  HwiSendPinResponse,
  FeeRates,
  ChangeNodeConfigParams,
  NodeConfigWithBlockchainInfo,
  OpenChannelRequestArgs,
  DecoratedOpenStatusUpdate,
  GenerateLightningInvoiceRequest
} from '@lily/types';

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

  getNodeConfig(): Promise<NodeConfigWithBlockchainInfo>;
  isTestnet(): Promise<boolean>;
  getHistoricalBitcoinPrice(): Promise<PriceForChart[]>;

  getCurrentBitcoinPrice(): Promise<string>;
  isConfirmedTransaction(txId: string): Promise<boolean>;

  getXpub({ deviceType, devicePath, path }: HwiXpubRequest): Promise<HwiXpubResponse>;
  enumerate(): Promise<HwiEnumerateResponse[]>;

  promptPin({ deviceType, devicePath }: HwiPromptPinRequest): Promise<HwiPromptPinResponse>;
  sendPin({ deviceType, devicePath, pin }: HwiSendPinRequest): Promise<HwiSendPinResponse>;
  estimateFee(): Promise<FeeRates>;
  changeNodeConfig({
    provider,
    host,
    port
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
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: ICallback<DecoratedOpenStatusUpdate>
  ): void;

  openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify): void;
  openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize): void;
  generateLightningInvoice({
    memo,
    value,
    lndConnectUri
  }: GenerateLightningInvoiceRequest): Promise<AddInvoiceResponse>;

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

  abstract getNodeConfig(): Promise<NodeConfigWithBlockchainInfo>;

  abstract isTestnet(): Promise<boolean>;

  abstract getHistoricalBitcoinPrice(): Promise<PriceForChart[]>;

  abstract getCurrentBitcoinPrice(): Promise<string>;

  abstract isConfirmedTransaction(txId: string): Promise<boolean>;

  abstract getXpub({ deviceType, devicePath, path }: HwiXpubRequest): Promise<HwiXpubResponse>;

  abstract signTransaction({
    deviceType,
    devicePath,
    psbt
  }: HwiSignTransactionRequest): Promise<HwiSignTransactionResponse>;

  abstract enumerate(): Promise<HwiEnumerateResponse[]>;

  abstract promptPin({
    deviceType,
    devicePath
  }: HwiPromptPinRequest): Promise<HwiPromptPinResponse>;

  abstract sendPin({ deviceType, devicePath, pin }: HwiSendPinRequest): Promise<HwiSendPinResponse>;

  abstract estimateFee(): Promise<FeeRates>;

  abstract changeNodeConfig({
    provider,
    host,
    port
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
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: ICallback<DecoratedOpenStatusUpdate>
  ): void;

  abstract openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify): Promise<void>;

  abstract openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize): Promise<void>;

  abstract generateLightningInvoice({
    memo,
    value,
    lndConnectUri
  }: GenerateLightningInvoiceRequest): Promise<AddInvoiceResponse>;

  abstract getLightningInvoice({ paymentHash }: LookupInvoiceMsg): Promise<Invoice>;

  abstract lightningConnect(lndConnectUri: string): void;

  abstract rescanBlockchain(
    startHeight: string,
    currentAccount: LilyAccount
  ): Promise<{ success: boolean }>;

  abstract getWalletInfo(currentAccount: LilyAccount): Promise<WalletInfo>;
}
