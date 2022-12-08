import type {
  AddInvoiceResponse,
  GetInfoResponse,
  Invoice,
  Payment,
  CloseChannelRequest,
  CloseStatusUpdate,
  OpenStatusUpdate,
  FundingPsbtVerify,
  FundingPsbtFinalize,
  LookupInvoiceMsg,
  QueryRoutesRequest,
  QueryRoutesResponse,
  ChannelBalanceResponse,
  SendPaymentRequest,
  BakeMacaroonResponse,
  DeleteMacaroonIDResponse,
  BakeMacaroonRequest,
  DeleteMacaroonIDRequest
} from '@lily-technologies/lnrpc';
import {
  ICallback,
  LightningConfig,
  LilyLightningAccount,
  OpenChannelRequestArgs
} from '@lily/types';

type Providers = 'LND';

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

  abstract initialize(): Promise<GetInfoResponse & ChannelBalanceResponse>;

  abstract getAccountData(
    account: LightningConfig,
    callback: (accountData: LilyLightningAccount) => void
  ): void;

  abstract generateInvoice({ memo, value }: Invoice): Promise<AddInvoiceResponse>;

  abstract getInvoice({ paymentHash }: LookupInvoiceMsg): Promise<Invoice>;

  abstract getRoutes({ pubKey, amt }: QueryRoutesRequest): Promise<QueryRoutesResponse>;

  abstract sendPayment(options: SendPaymentRequest, callback: (data: Payment) => void): void;

  abstract openChannelInitialize(
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: ICallback<OpenStatusUpdate>
  ): void;

  abstract openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify): Promise<void>;

  abstract openChannelFinalize(psbtFinalize: FundingPsbtFinalize): Promise<void>;

  abstract closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (data: CloseStatusUpdate) => void
  ): Promise<void>;

  abstract bakeMacaroon({
    permissions,
    rootKeyId,
    allowExternalPermissions
  }: BakeMacaroonRequest): Promise<BakeMacaroonResponse>;

  abstract revokeMacaroon({
    rootKeyId
  }: DeleteMacaroonIDRequest): Promise<DeleteMacaroonIDResponse>;
}
