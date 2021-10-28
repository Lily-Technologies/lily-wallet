import {
  LilyOnchainAccount,
  FeeRates,
  OnChainConfig,
  NodeConfigWithBlockchainInfo
} from 'src/types';
import { Network, networks } from 'bitcoinjs-lib';

export type Providers = 'Blockstream' | 'Electrum' | 'Bitcoin Core' | 'Custom Node';

export interface ProviderInterface {
  getAccountData: (account: OnChainConfig) => Promise<LilyOnchainAccount>;
  broadcastTransaction: (txHex: string) => Promise<string>;
  estimateFee: () => Promise<FeeRates>;
}

export abstract class BaseProvider implements ProviderInterface {
  provider: Providers;
  connected: boolean;
  blocks: number;
  initialblockdownload: boolean;
  verificationprogress: number;
  network: Network;

  constructor(provider: Providers, testnet: boolean) {
    this.provider = provider;
    this.connected = false;
    this.blocks = 0;
    this.initialblockdownload = false;
    this.verificationprogress = 100;
    this.network = testnet ? networks.testnet : networks.bitcoin;
  }

  getConfig(): NodeConfigWithBlockchainInfo {
    return {
      baseURL: '',
      provider: this.provider,
      connected: this.connected,
      blocks: this.blocks,
      initialblockdownload: this.initialblockdownload,
      verificationprogress: this.verificationprogress
    };
  }

  setProvider(name: Providers) {
    this.provider = name;
  }

  setTestnet(testnet: boolean) {
    this.network = testnet ? networks.testnet : networks.bitcoin;
  }

  setConnected(status: boolean) {
    this.connected = status;
    return status;
  }

  setCurrentBlockHeight(blockHeight: number) {
    this.blocks = blockHeight;
    return blockHeight;
  }

  setInitialBlockDownload(status: boolean): boolean {
    this.initialblockdownload = status;
    return this.initialblockdownload;
  }

  setVerificationProgress(progress: number): number {
    this.verificationprogress = progress;
    return this.verificationprogress;
  }

  abstract initialize(): void;

  abstract getAccountData(account: OnChainConfig): Promise<LilyOnchainAccount>;

  // returns txId
  abstract broadcastTransaction(txHex: string): Promise<string>;

  abstract estimateFee(): Promise<FeeRates>;

  abstract isConfirmedTransaction(txId: string): Promise<boolean>;
}
