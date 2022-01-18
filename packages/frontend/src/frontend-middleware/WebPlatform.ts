import axios, { AxiosResponse } from 'axios';

import type {
  Payment,
  CloseStatusUpdate,
  AddInvoiceResponse,
  CloseChannelRequest,
  FundingPsbtVerify,
  FundingPsbtFinalize,
  OpenStatusUpdate
} from '@lily-technologies/lnrpc';

import { WalletInfo } from 'bitcoin-simple-rpc';

import { BasePlatform } from './BasePlatform';

import {
  File,
  OnChainConfig,
  VaultConfig,
  LightningConfig,
  LilyLightningAccount,
  LilyOnchainAccount,
  PriceForChart,
  HwiXpubRequest,
  HwiSignTransactionRequest,
  HwiEnumerateResponse,
  HwiPromptPinRequest,
  HwiPromptPinResponse,
  HwiSendPinRequest,
  HwiSendPinResponse,
  FeeRates,
  ChangeNodeConfigParams,
  NodeConfigWithBlockchainInfo,
  DecoratedOpenStatusUpdate,
  OpenChannelRequestArgs,
  GetLightningInvoiceRequest,
  LilyAccount,
  ICallback,
  HwiXpubResponse,
  HwiSignTransactionResponse
} from '@lily/types';

const HOST = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;

export class WebPlatform extends BasePlatform {
  constructor() {
    super('Web');
  }

  async quit() {
    throw new Error('Function not implemented');
  }

  async getConfig(): Promise<File> {
    try {
      const { data }: AxiosResponse<File> = await axios.get(`${HOST}/get-config`);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject('Error getting config');
    }
  }

  async saveConfig(encryptedConfigObject: string) {
    const { data } = await axios.post(`${HOST}/save-config`, {
      encryptedConfigFile: encryptedConfigObject
    });
  }

  async downloadFile(file: string, filename: string) {
    await window.ipcRenderer.invoke(`${HOST}/download-item`, {
      data: file,
      filename: filename
    });
  }

  getOnchainData(
    config: VaultConfig | OnChainConfig,
    callback: (accountInfo: LilyOnchainAccount) => void
  ) {
    axios.post<LilyOnchainAccount>(`${HOST}/account-data`, config).then(({ data }) => {
      callback(data);
    });
  }

  getLightningData(config: LightningConfig, callback: (accountInfo: LilyLightningAccount) => void) {
    axios.post<LilyLightningAccount>(`${HOST}/lightning-account-data`, config).then(({ data }) => {
      callback(data);
    });
  }

  async getNodeConfig() {
    const { data } = await axios.get<NodeConfigWithBlockchainInfo>(`${HOST}/get-node-config`);
    return Promise.resolve(data);
  }

  async isTestnet() {
    const { data } = await axios.get<boolean>(`${HOST}/bitcoin-network`);
    return Promise.resolve(data);
  }

  async getHistoricalBitcoinPrice() {
    const { data } = await axios.get<PriceForChart[]>(`${HOST}/historical-btc-price`);
    return Promise.resolve(data);
  }

  async getCurrentBitcoinPrice() {
    const { data } = await axios.get<string>(`${HOST}/current-btc-price`);
    return Promise.resolve(data);
  }

  async isConfirmedTransaction(txId: string) {
    const { data } = await axios.post<boolean>(`${HOST}/isConfirmedTransaction`, {
      txId
    });
    return Promise.resolve(data);
  }

  async getXpub({ deviceType, devicePath, path }: HwiXpubRequest) {
    const { data } = await axios.post<HwiXpubResponse>(`${HOST}/xpub`, {
      deviceType,
      devicePath,
      path
    });
    return Promise.resolve(data);
  }

  async signTransaction({ deviceType, devicePath, psbt }: HwiSignTransactionRequest) {
    const { data } = await axios.post<HwiSignTransactionResponse>(`${HOST}/sign`, {
      deviceType,
      devicePath,
      psbt
    });
    return Promise.resolve(data);
  }

  async enumerate() {
    const { data } = await axios.get<HwiEnumerateResponse[]>(`${HOST}/enumerate`);
    return Promise.resolve(data);
  }

  async promptPin({ deviceType, devicePath }: HwiPromptPinRequest): Promise<HwiPromptPinResponse> {
    const { data } = await axios.post<HwiPromptPinResponse>(`${HOST}/promptpin`, {
      deviceType,
      devicePath
    });
    return Promise.resolve(data);
  }

  async sendPin({ deviceType, devicePath, pin }: HwiSendPinRequest): Promise<HwiSendPinResponse> {
    const { data } = await axios.post<HwiSendPinResponse>(`${HOST}/sendpin`, {
      deviceType,
      devicePath,
      pin
    });
    return Promise.resolve(data);
  }

  async estimateFee(): Promise<FeeRates> {
    const { data } = await axios.get<FeeRates>(`${HOST}/estimate-fee`);
    return Promise.resolve(data);
  }

  async changeNodeConfig({
    provider,
    host,
    port
  }: ChangeNodeConfigParams): Promise<NodeConfigWithBlockchainInfo> {
    const { data } = await axios.post<NodeConfigWithBlockchainInfo>(`${HOST}/changeNodeConfig`, {
      nodeConfig: {
        provider,
        baseURL: host,
        port
      }
    });

    return Promise.resolve(data);
  }

  async broadcastTransaction(txHex: string) {
    const { data } = await axios.post<string>(`${HOST}/broadcastTx`, {
      txHex
    });
    return Promise.resolve(data);
  }

  // Lightning

  async sendLightningPayment(
    paymentRequest: string,
    config: LightningConfig,
    callback: (payment: Payment) => void
  ) {
    const { data } = await axios.post<Payment>(`${HOST}/lightning-send-payment`, {
      paymentRequest: paymentRequest,
      config: config
    });

    callback(data);
  }

  async closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (response: CloseStatusUpdate) => void
  ) {
    const { data } = await axios.post<CloseStatusUpdate>(`${HOST}/close-channel`, {
      channelPoint,
      deliveryAddress
    });

    callback(data);
  }

  async openChannelInitiate({ lightningAddress, channelAmount }: OpenChannelRequestArgs) {
    const { data } = await axios.post<DecoratedOpenStatusUpdate>(`${HOST}/open-channel`, {
      lightningAddress,
      channelAmount
    });

    return Promise.resolve(data);
  }

  async openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify) {
    try {
      await axios.post<OpenStatusUpdate>(`${HOST}/open-channel-verify`, {
        fundedPsbt,
        pendingChanId
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize) {
    const { data } = await axios.post<OpenStatusUpdate>(`${HOST}/open-channel-finalize`, {
      signedPsbt,
      pendingChanId
    });
  }

  async getLightningInvoice({ memo, value, lndConnectUri }: GetLightningInvoiceRequest) {
    const { data } = await axios.post<AddInvoiceResponse>(`${HOST}/lightning-invoice`, {
      memo,
      value,
      lndConnectUri
    });

    return Promise.resolve(data);
  }

  async lightningConnect(lndConnectUri: string) {
    await axios.post(`${HOST}/lightning-connect`, {
      lndConnectUri
    });
  }

  async rescanBlockchain(startHeight: string, currentAccount: LilyOnchainAccount) {
    const { data } = await axios.post<{ success: boolean }>(`${HOST}/rescanBlockchain`, {
      startHeight,
      currentAccount
    });

    return Promise.resolve(data);
  }

  async getWalletInfo(currentAccount: LilyAccount) {
    const { data } = await axios.post<WalletInfo>(`${HOST}/getWalletInfo`, {
      currentAccount
    });

    return Promise.resolve(data);
  }
}
