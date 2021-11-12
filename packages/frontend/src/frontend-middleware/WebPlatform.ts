import axios, { AxiosResponse } from 'axios';

import {
  Payment,
  CloseStatusUpdate,
  AddInvoiceResponse,
  CloseChannelRequest,
  FundingPsbtVerify,
  FundingPsbtFinalize,
  OpenStatusUpdate
} from '@radar/lnrpc';

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
  HwiRequestXpub,
  HwiRequestSignTransaction,
  HwiResponseEnumerate,
  HwiRequestPromptPin,
  HwiResponsePromptPin,
  HwiRequestSendPin,
  HwiResponseSendPin,
  FeeRates,
  ChangeNodeConfigParams,
  NodeConfigWithBlockchainInfo,
  DecoratedOpenStatusUpdate,
  OpenChannelRequestArgs,
  GetLightningInvoiceRequest,
  LilyAccount,
  NodeConfig
} from '@lily/types';

const HOST = 'http://localhost:8080';

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
    axios.post(`${HOST}/account-data`, config).then(({ data }) => {
      console.log('data: ', data);
      callback(data);
    });
  }

  getLightningData(config: LightningConfig, callback: (accountInfo: LilyLightningAccount) => void) {
    axios.post(`${HOST}/lightning-account-data`, config).then(({ data }) => {
      console.log('data: ', data);
      callback(data);
    });
  }

  async getNodeConfig() {
    const { data }: AxiosResponse<NodeConfigWithBlockchainInfo> = await axios.get(
      `${HOST}/get-node-config`
    );
    return Promise.resolve(data);
  }

  async isTestnet() {
    const { data }: AxiosResponse<boolean> = await axios.get(`${HOST}/bitcoin-network`);
    return Promise.resolve(data);
  }

  async getHistoricalBitcoinPrice() {
    const { data }: AxiosResponse<PriceForChart[]> = await axios.get(
      `${HOST}/historical-btc-price`
    );
    console.log('data: ', data);
    return Promise.resolve(data);
  }

  async getCurrentBitcoinPrice() {
    const { data }: AxiosResponse<string> = await axios.get(`${HOST}/current-btc-price`);
    return Promise.resolve(data);
  }

  async isConfirmedTransaction(txId: string) {
    const { data }: AxiosResponse<boolean> = await axios.post(`${HOST}/isConfirmedTransaction`, {
      txId
    });
    return Promise.resolve(data);
  }

  async getXpub({ deviceType, devicePath, path }: HwiRequestXpub) {
    const { data } = await axios.post(`${HOST}/xpub`, { deviceType, devicePath, path });
    return Promise.resolve(data);
  }

  async signTransaction({ deviceType, devicePath, psbt }: HwiRequestSignTransaction) {
    const { data } = await axios.post(`${HOST}/sign`, {
      deviceType,
      devicePath,
      psbt
    });
    return Promise.resolve(data);
  }

  async enumerate(): Promise<HwiResponseEnumerate[]> {
    const { data } = await axios.get(`${HOST}/enumerate`);
    return Promise.resolve(data);
  }

  async promptPin({ deviceType, devicePath }: HwiRequestPromptPin): Promise<HwiResponsePromptPin> {
    const { data }: AxiosResponse<HwiResponsePromptPin> = await axios.post(`${HOST}/promptpin`, {
      deviceType,
      devicePath
    });
    return Promise.resolve(data);
  }

  async sendPin({ deviceType, devicePath, pin }: HwiRequestSendPin): Promise<HwiResponseSendPin> {
    const { data }: AxiosResponse<HwiResponseSendPin> = await axios.post(`${HOST}/sendpin`, {
      deviceType,
      devicePath,
      pin
    });
    return Promise.resolve(data);
  }

  async estimateFee(): Promise<FeeRates> {
    const { data } = await axios.get(`${HOST}/estimate-fee`);
    return Promise.resolve(data);
  }

  async changeNodeConfig({
    provider,
    host,
    username,
    password
  }: ChangeNodeConfigParams): Promise<NodeConfigWithBlockchainInfo> {
    const { data }: AxiosResponse<NodeConfigWithBlockchainInfo> = await axios.post(
      `${HOST}/changeNodeConfig`,
      {
        nodeConfig: {
          provider,
          baseURL: host,
          auth: {
            username,
            password
          }
        }
      }
    );

    return Promise.resolve(data);
  }

  async broadcastTransaction(txHex: string) {
    const { data }: AxiosResponse<string> = await axios.post(`${HOST}/broadcastTx`, {
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
    const { data }: AxiosResponse<Payment> = await axios.post(`${HOST}/lightning-send-payment`, {
      paymentRequest: paymentRequest,
      config: config
    });

    callback(data);
  }

  async closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (response: CloseStatusUpdate) => void
  ) {
    const { data }: AxiosResponse<CloseStatusUpdate> = await axios.post(`${HOST}/close-channel`, {
      channelPoint,
      deliveryAddress
    });

    callback(data);
  }

  async openChannelInitiate(
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: (response: DecoratedOpenStatusUpdate) => void
  ) {
    const { data }: AxiosResponse<DecoratedOpenStatusUpdate> = await axios.post(
      `${HOST}/open-channel`,
      {
        lightningAddress,
        channelAmount
      }
    );

    callback(data);
  }

  async openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify) {
    const { data }: AxiosResponse<OpenStatusUpdate> = await axios.post(
      `${HOST}/open-channel-verify`,
      {
        fundedPsbt,
        pendingChanId
      }
    );
  }

  async openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize) {
    const { data }: AxiosResponse<OpenStatusUpdate> = await axios.post(
      `${HOST}/open-channel-finalize`,
      {
        signedPsbt,
        pendingChanId
      }
    );
  }

  async getLightningInvoice({ memo, value, lndConnectUri }: GetLightningInvoiceRequest) {
    const { data }: AxiosResponse<AddInvoiceResponse> = await axios.post(
      `${HOST}/lightning-invoice`,
      {
        memo,
        value,
        lndConnectUri
      }
    );

    return Promise.resolve(data);
  }

  async lightningConnect(lndConnectUri: string) {
    await axios.post(`${HOST}/lightning-connect`, {
      lndConnectUri
    });
  }

  async rescanBlockchain(startHeight: string, currentAccount: LilyOnchainAccount) {
    const { data }: AxiosResponse<{ success: boolean }> = await axios.post(
      `${HOST}/rescanBlockchain`,
      {
        startHeight,
        currentAccount
      }
    );

    return Promise.resolve(data);
  }

  async getWalletInfo(currentAccount: LilyAccount) {
    const { data }: AxiosResponse<WalletInfo> = await axios.post(`${HOST}/getWalletInfo`, {
      currentAccount
    });

    return Promise.resolve(data);
  }
}
