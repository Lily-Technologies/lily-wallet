import {
  AddInvoiceResponse,
  GetInfoResponse,
  Invoice,
  Payment,
  CloseChannelRequest,
  CloseStatusUpdate,
  OpenStatusUpdate,
  FundingPsbtVerify,
  FundingPsbtFinalize
} from '@radar/lnrpc';
import { LightningConfig, LilyLightningAccount, OpenChannelRequest } from 'src/types';

export type Providers = 'LND';

export interface LightningProviderInterface {
  getAccountData: (
    account: LightningConfig,
    callback: (accountData: LilyLightningAccount) => void
  ) => void;
  initialize(): Promise<GetInfoResponse>;
}

export abstract class LightningBaseProvider implements LightningProviderInterface {
  provider: Providers;
  connected: boolean;
  lndConnectUri: string;

  constructor(provider: Providers, lndConnectUri: string) {
    this.provider = provider;
    this.connected = false;
    this.lndConnectUri = lndConnectUri;
  }

  setProvider(name: Providers) {
    this.provider = name;
  }

  setConnected(status: boolean) {
    this.connected = status;
    return status;
  }

  abstract initialize(): Promise<GetInfoResponse>;

  abstract getAccountData(
    account: LightningConfig,
    callback: (accountData: LilyLightningAccount) => void
  ): void;

  abstract getInvoice({ memo, value }: Invoice): Promise<AddInvoiceResponse>;

  abstract sendPayment(paymentRequest: string, callback: (data: Payment) => void): void;

  abstract openChannelInitialize(
    { lightningAddress, channelAmount }: OpenChannelRequest,
    callback: (data: OpenStatusUpdate) => void
  ): Promise<void>;

  abstract openChannelVerify({
    fundedPsbt: finalPsbt,
    pendingChanId
  }: FundingPsbtVerify): Promise<void>;

  abstract openChannelFinalize(psbtFinalize: FundingPsbtFinalize): Promise<void>;

  abstract closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (data: CloseStatusUpdate) => void
  ): Promise<void>;
}
