import axios, { AxiosResponse } from 'axios';

import type {
  Payment,
  CloseStatusUpdate,
  AddInvoiceResponse,
  CloseChannelRequest,
  FundingPsbtVerify,
  FundingPsbtFinalize,
  OpenStatusUpdate,
  LookupInvoiceMsg,
  Invoice,
  QueryRoutesRequest,
  QueryRoutesResponse
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
  GenerateLightningInvoiceRequest,
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
      const { data }: AxiosResponse<File> = await axios.get(`/get-config`);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject('Error getting config');
    }
  }

  async saveConfig(encryptedConfigObject: string) {
    const { data } = await axios.post(`/save-config`, {
      encryptedConfigFile: encryptedConfigObject
    });
  }

  async downloadFile(file: string, filename: string) {
    try {
      const fileBlob = new Blob([file], { type: 'text/plain' });
      const filedownload = document.createElement('a');
      filedownload.href = URL.createObjectURL(fileBlob);
      filedownload.download = filename;
      filedownload.click();
      setTimeout(() => URL.revokeObjectURL(filedownload.href), 60000);
      // const { data }: AxiosResponse<File> = await axios.post(`/download-item`, {
      //   data: file,
      //   filename: filename
      // });
      // console.log('data: ', data);
      // return Promise.resolve(data);
    } catch (e) {
      return Promise.reject('Error downloading file');
    }
  }

  getOnchainData(
    config: VaultConfig | OnChainConfig,
    callback: (accountInfo: LilyOnchainAccount) => void
  ) {
    axios.post<LilyOnchainAccount>(`/account-data`, config).then(({ data }) => {
      callback(data);
    });
  }

  getLightningData(config: LightningConfig, callback: (accountInfo: LilyLightningAccount) => void) {
    axios.post<LilyLightningAccount>(`/lightning-account-data`, config).then(({ data }) => {
      callback(data);
    });
  }

  async getNodeConfig() {
    const { data } = await axios.get<NodeConfigWithBlockchainInfo>(`/get-node-config`);
    return Promise.resolve(data);
  }

  async doesAddressHaveTransaction(address: string): Promise<boolean> {
    const { data } = await axios.post<boolean>(`/does-address-have-transaction`, {
      address
    });
    return Promise.resolve(data);
  }

  async isTestnet() {
    const { data } = await axios.get<boolean>(`/bitcoin-network`);
    return Promise.resolve(data);
  }

  async getHistoricalBitcoinPrice() {
    const { data } = await axios.get<PriceForChart[]>(`/historical-btc-price`);
    return Promise.resolve(data);
  }

  async getCurrentBitcoinPrice() {
    const { data } = await axios.get<string>(`/current-btc-price`);
    return Promise.resolve(data);
  }

  async isConfirmedTransaction(txId: string) {
    const { data } = await axios.post<boolean>(`/isConfirmedTransaction`, {
      txId
    });
    return Promise.resolve(data);
  }

  async getXpub({ deviceType, devicePath, path }: HwiXpubRequest) {
    const { data } = await axios.post<HwiXpubResponse>(`/xpub`, {
      deviceType,
      devicePath,
      path
    });
    return Promise.resolve(data);
  }

  async signTransaction({ deviceType, devicePath, psbt }: HwiSignTransactionRequest) {
    const { data } = await axios.post<HwiSignTransactionResponse>(`/sign`, {
      deviceType,
      devicePath,
      psbt
    });
    return Promise.resolve(data);
  }

  async enumerate() {
    const { data } = await axios.get<HwiEnumerateResponse[]>(`/enumerate`);
    return Promise.resolve(data);
  }

  async promptPin({ deviceType, devicePath }: HwiPromptPinRequest): Promise<HwiPromptPinResponse> {
    const { data } = await axios.post<HwiPromptPinResponse>(`/promptpin`, {
      deviceType,
      devicePath
    });
    return Promise.resolve(data);
  }

  async sendPin({ deviceType, devicePath, pin }: HwiSendPinRequest): Promise<HwiSendPinResponse> {
    const { data } = await axios.post<HwiSendPinResponse>(`/sendpin`, {
      deviceType,
      devicePath,
      pin
    });
    return Promise.resolve(data);
  }

  async estimateFee(): Promise<FeeRates> {
    const { data } = await axios.get<FeeRates>(`/estimate-fee`);
    return Promise.resolve(data);
  }

  async changeNodeConfig({
    provider,
    host,
    port
  }: ChangeNodeConfigParams): Promise<NodeConfigWithBlockchainInfo> {
    const { data } = await axios.post<NodeConfigWithBlockchainInfo>(`/changeNodeConfig`, {
      nodeConfig: {
        provider,
        baseURL: host,
        port
      }
    });

    return Promise.resolve(data);
  }

  async broadcastTransaction(txHex: string) {
    const { data } = await axios.post<string>(`/broadcastTx`, {
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
    const { data } = await axios.post<Payment>(`/lightning-send-payment`, {
      paymentRequest: paymentRequest,
      config: config
    });

    callback(data);
  }

  async closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (response: CloseStatusUpdate) => void
  ) {
    const { data } = await axios.post<CloseStatusUpdate>(`/close-channel`, {
      channelPoint,
      deliveryAddress
    });

    callback(data);
  }

  async openChannelInitiate(
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: ICallback<DecoratedOpenStatusUpdate>
  ) {
    try {
      const { data } = await axios.post<DecoratedOpenStatusUpdate>(`/open-channel`, {
        lightningAddress,
        channelAmount
      });

      callback(null, data);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response) {
        callback(e.response.data);
      } else {
        callback(e);
      }
    }
  }

  async openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify) {
    try {
      await axios.post<OpenStatusUpdate>(`/open-channel-verify`, {
        fundedPsbt,
        pendingChanId
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize) {
    const { data } = await axios.post<OpenStatusUpdate>(`/open-channel-finalize`, {
      signedPsbt,
      pendingChanId
    });
  }

  async generateLightningInvoice({ memo, value, lndConnectUri }: GenerateLightningInvoiceRequest) {
    try {
      const { data } = await axios.post<AddInvoiceResponse>(`/generate-invoice`, {
        memo,
        value,
        lndConnectUri
      });

      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getLightningInvoice({ paymentHash }: LookupInvoiceMsg) {
    try {
      const { data } = await axios.get<Invoice>(`/invoice/${paymentHash!}`);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getRoutes({ pubKey, amt }: QueryRoutesRequest) {
    try {
      const { data } = await axios.post<QueryRoutesResponse>(`/get-routes`, {
        pubKey,
        amt
      });
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async lightningConnect(lndConnectUri: string) {
    await axios.post(`/lightning-connect`, {
      lndConnectUri
    });
  }

  async rescanBlockchain(startHeight: string, currentAccount: LilyOnchainAccount) {
    const { data } = await axios.post<{ success: boolean }>(`/rescanBlockchain`, {
      startHeight,
      currentAccount
    });

    return Promise.resolve(data);
  }

  async getWalletInfo(currentAccount: LilyAccount) {
    const { data } = await axios.post<WalletInfo>(`/getWalletInfo`, {
      currentAccount
    });

    return Promise.resolve(data);
  }
}
