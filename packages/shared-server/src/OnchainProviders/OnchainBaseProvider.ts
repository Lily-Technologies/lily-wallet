import {
  LilyOnchainAccount,
  FeeRates,
  OnChainConfig,
  NodeConfigWithBlockchainInfo,
  OnchainProviderConnectionDetails
} from '@lily/types';
import { Network, networks } from 'bitcoinjs-lib';

import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

type Providers = 'Esplora' | 'Electrum' | 'Bitcoin Core';

export interface OnchainProviderInterface {
  getAccountData: (
    account: OnChainConfig,
    db: Database<sqlite3.Database, sqlite3.Statement>
  ) => Promise<LilyOnchainAccount>;
  broadcastTransaction: (txHex: string) => Promise<string>;
  estimateFee: () => Promise<FeeRates>;
}

export abstract class OnchainBaseProvider implements OnchainProviderInterface {
  provider: Providers;
  connectionDetails: OnchainProviderConnectionDetails;
  connected: boolean;
  blocks: number;
  initialblockdownload: boolean;
  verificationprogress: number;
  network: Network;

  constructor(
    provider: Providers,
    testnet: boolean,
    connectionDetails: OnchainProviderConnectionDetails
  ) {
    this.provider = provider;
    this.connectionDetails = connectionDetails;
    this.connected = false;
    this.blocks = 0;
    this.initialblockdownload = false;
    this.verificationprogress = 100;
    this.network = testnet ? networks.testnet : networks.bitcoin;
  }

  getConfig(): NodeConfigWithBlockchainInfo {
    return {
      provider: this.provider,
      connectionDetails: this.connectionDetails,
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

  abstract getAccountData(
    account: OnChainConfig,
    db: Database<sqlite3.Database, sqlite3.Statement>
  ): Promise<LilyOnchainAccount>;

  // returns txId
  abstract broadcastTransaction(txHex: string): Promise<string>;

  abstract estimateFee(): Promise<FeeRates>;

  abstract isConfirmedTransaction(txId: string): Promise<boolean>;

  abstract getTransactionsFromAddress(address: string): Promise<any>;
}
