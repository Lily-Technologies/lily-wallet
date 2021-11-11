import {
  Payment,
  CloseStatusUpdate,
  AddInvoiceResponse,
  CloseChannelRequest,
  FundingPsbtVerify,
  FundingPsbtFinalize
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
  LilyAccount
} from '@lily/types';

export class ElectronPlatform extends BasePlatform {
  constructor() {
    super('Electron');
  }

  async quit() {
    window.ipcRenderer.invoke('/quit');
  }

  async getConfig(): Promise<File> {
    try {
      const result: File = await window.ipcRenderer.invoke('/get-config');
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject('Error getting config');
    }
  }

  async saveConfig(encryptedConfigObject: string) {
    await window.ipcRenderer.invoke('/save-config', {
      encryptedConfigFile: encryptedConfigObject
    });
  }

  async downloadFile(file: string, filename: string) {
    await window.ipcRenderer.invoke('/download-item', {
      data: file,
      filename: filename
    });
  }

  getOnchainData(
    config: VaultConfig | OnChainConfig,
    callback: (accountInfo: LilyOnchainAccount) => void
  ) {
    window.ipcRenderer.send('/account-data', config);

    window.ipcRenderer.on('/account-data', (_event, ...args) => {
      const accountInfo = args[0];
      callback(accountInfo);
    });
  }

  getLightningData(config: LightningConfig, callback: (accountInfo: LilyLightningAccount) => void) {
    window.ipcRenderer.send('/lightning-account-data', config);

    window.ipcRenderer.on('/lightning-account-data', (_event, ...args) => {
      const accountInfo: LilyLightningAccount = args[0];
      callback(accountInfo);
    });
  }

  async getNodeConfig() {
    const config = await window.ipcRenderer.invoke('/get-node-config');
    return Promise.resolve(config);
  }

  async isTestnet() {
    const isTestnet = await window.ipcRenderer.invoke('/bitcoin-network');
    return Promise.resolve(isTestnet);
  }

  async getHistoricalBitcoinPrice() {
    const response: PriceForChart[] = await window.ipcRenderer.invoke('/historical-btc-price');
    return Promise.resolve(response);
  }

  async getCurrentBitcoinPrice() {
    const response: string = await window.ipcRenderer.invoke('/current-btc-price');
    return Promise.resolve(response);
  }

  async isConfirmedTransaction(txId: string) {
    const isConfirmed = await window.ipcRenderer.invoke('/isConfirmedTransaction', { txId });
    return Promise.resolve(isConfirmed);
  }

  async getXpub({ deviceType, devicePath, path }: HwiRequestXpub) {
    const xpub = await window.ipcRenderer.invoke('/xpub', { deviceType, devicePath, path });
    return Promise.resolve(xpub);
  }

  async signTransaction({ deviceType, devicePath, psbt }: HwiRequestSignTransaction) {
    const response = await window.ipcRenderer.invoke('/sign', {
      deviceType,
      devicePath,
      psbt
    });
    return Promise.resolve(response);
  }

  async enumerate(): Promise<HwiResponseEnumerate[]> {
    const response = await await window.ipcRenderer.invoke('/enumerate');
    return Promise.resolve(response);
  }

  async promptPin({ deviceType, devicePath }: HwiRequestPromptPin): Promise<HwiResponsePromptPin> {
    const response: HwiResponsePromptPin = await window.ipcRenderer.invoke('/promptpin', {
      deviceType,
      devicePath
    });
    return Promise.resolve(response);
  }

  async sendPin({ deviceType, devicePath, pin }: HwiRequestSendPin): Promise<HwiResponseSendPin> {
    const response: HwiResponseSendPin = await window.ipcRenderer.invoke('/sendpin', {
      deviceType,
      devicePath,
      pin
    });
    return Promise.resolve(response);
  }

  async estimateFee(): Promise<FeeRates> {
    const response = await window.ipcRenderer.invoke('/estimate-fee');
    return Promise.resolve(response);
  }

  async changeNodeConfig({
    provider,
    host,
    username,
    password
  }: ChangeNodeConfigParams): Promise<NodeConfigWithBlockchainInfo> {
    const response = await window.ipcRenderer.invoke('/changeNodeConfig', {
      nodeConfig: {
        provider,
        baseURL: host,
        auth: {
          username,
          password
        }
      }
    });

    return Promise.resolve(response);
  }

  async broadcastTransaction(txHex: string) {
    const response = await window.ipcRenderer.invoke('/broadcastTx', {
      txHex
    });
    return Promise.resolve(response);
  }

  // Lightning

  async sendLightningPayment(
    paymentRequest: string,
    config: LightningConfig,
    callback: (payment: Payment) => void
  ) {
    window.ipcRenderer.send('/lightning-send-payment', {
      paymentRequest: paymentRequest,
      config: config
    });

    window.ipcRenderer.on('/lightning-send-payment', async (_event: any, ...args: any) => {
      const response = args[0];
      callback(response);
    });
  }

  async closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (response: CloseStatusUpdate) => void
  ) {
    window.ipcRenderer.send('/close-channel', {
      channelPoint,
      deliveryAddress
    });

    window.ipcRenderer.on('/close-channel', async (_event: any, ...args: any) => {
      const response: CloseStatusUpdate = args[0];
      callback(response);
      // TODO: check for errors
    });
  }

  async openChannelInitiate(
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: (response: DecoratedOpenStatusUpdate) => void
  ) {
    window.ipcRenderer.send('/open-channel', {
      lightningAddress,
      channelAmount
    });

    window.ipcRenderer.on('/open-channel', async (_event: any, ...args: any) => {
      const openChannelResponse: DecoratedOpenStatusUpdate = args[0];
      callback(openChannelResponse);
    });
  }

  async openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify) {
    window.ipcRenderer.send('/open-channel-verify', {
      fundedPsbt,
      pendingChanId
    });
  }

  async openChannelFinalize({ signedPsbt, pendingChanId }: FundingPsbtFinalize) {
    window.ipcRenderer.send('/open-channel-finalize', {
      signedPsbt,
      pendingChanId
    });
  }

  async getLightningInvoice({ memo, value, lndConnectUri }: GetLightningInvoiceRequest) {
    const response: AddInvoiceResponse = await window.ipcRenderer.invoke('/lightning-invoice', {
      memo,
      value,
      lndConnectUri
    });

    return Promise.resolve(response);
  }

  async lightningConnect(lndConnectUri: string) {
    await window.ipcRenderer.invoke('/lightning-connect', {
      lndConnectUri
    });
  }

  async rescanBlockchain(startHeight: string, currentAccount: LilyOnchainAccount) {
    const response = await window.ipcRenderer.invoke('/rescanBlockchain', {
      startHeight,
      currentAccount
    });

    return Promise.resolve(response);
  }

  async getWalletInfo(currentAccount: LilyAccount) {
    const response: WalletInfo = await window.ipcRenderer.invoke('/getWalletInfo', {
      currentAccount
    });

    return Promise.resolve(response);
  }
}
