import axios from 'axios';
import { Network } from 'bitcoinjs-lib';
import { blockExplorerAPIURL, MAINNET, TESTNET } from 'unchained-bitcoin';
import BigNumber from 'bignumber.js';

import { OnchainBaseProvider } from '.';

import {
  getAddressFromAccount,
  getUnchainedNetworkFromBjslibNetwork,
  serializeTransactions
} from '..//utils/accountMap';

import {
  LilyOnchainAccount,
  FeeRates,
  Address,
  OnChainConfig,
  Transaction,
  UTXO
} from '@lily/types';

export class BlockstreamProvider extends OnchainBaseProvider {
  constructor(testnet: boolean) {
    super('Blockstream', testnet);
  }

  async initialize() {
    try {
      const { data } = await await axios.get(`https://blockstream.info/api/blocks/tip/height`);

      this.setCurrentBlockHeight(data);
      this.setConnected(true);
    } catch (e) {
      this.setCurrentBlockHeight(0);
      this.setConnected(false);
    }
  }

  async getAccountData(account: OnChainConfig): Promise<LilyOnchainAccount> {
    const {
      receiveAddresses,
      changeAddresses,
      unusedReceiveAddresses,
      unusedChangeAddresses,
      transactions
    } = await this.scanForAddressesAndTransactions(account, 10);

    console.log(`(${account.id}): Serializing transactions...`);
    const organizedTransactions = serializeTransactions(
      transactions as Transaction[],
      receiveAddresses,
      changeAddresses
    );

    console.log(`(${account.id}): Getting UTXO data...`);
    const availableUtxos = await this.getUtxosForAddresses(
      receiveAddresses.concat(changeAddresses)
    );

    console.log(`Calculating current balance for ${account.id}`);
    const currentBalance = availableUtxos.reduce(
      (accum, utxo) => accum.plus(utxo.value),
      new BigNumber(0)
    );

    return {
      loading: false,
      name: account.name,
      config: account,
      addresses: receiveAddresses,
      changeAddresses,
      transactions: organizedTransactions,
      unusedAddresses: unusedReceiveAddresses,
      unusedChangeAddresses,
      availableUtxos,
      currentBalance: currentBalance.toNumber()
    };
  }

  async broadcastTransaction(txHex: string): Promise<string> {
    const network = this.network.bech32 === 'bc' ? MAINNET : TESTNET;
    console.log('txHex: ', txHex);
    console.log('network: ', network);
    const { data } = await axios.post(blockExplorerAPIURL('/tx', network), txHex);
    console.log('data: ', data);
    return data;
  }

  async estimateFee(): Promise<FeeRates> {
    try {
      const { data: feeRates } = await await axios.get(
        'https://mempool.space/api/v1/fees/recommended'
      ); // TODO: should catch if URL is down
      return Promise.resolve(feeRates);
    } catch (e) {
      throw new Error('Error retrieving fees from mempool.space. Please try again.');
    }
  }

  async scanForAddressesAndTransactions(account: OnChainConfig, limitGap: number) {
    console.log(`(${account.id}): Deriving addresses and checking for transactions...`);
    const receiveAddresses: Address[] = [];
    const changeAddresses: Address[] = [];
    let transactions: Transaction[] = [];

    const unusedReceiveAddresses: Address[] = [];
    const unusedChangeAddresses: Address[] = [];

    let gap = 0;
    let i = 0;

    while (gap < limitGap) {
      const receiveAddress = getAddressFromAccount(account, `m/0/${i}`, this.network);

      const receiveTxs = await this.getTransactionsFromAddress(receiveAddress.address);
      if (!receiveTxs.length) {
        unusedReceiveAddresses.push(receiveAddress);
      } else {
        receiveAddresses.push(receiveAddress);
        transactions = [...transactions, ...receiveTxs];
      }

      const changeAddress = getAddressFromAccount(account, `m/1/${i}`, this.network);

      const changeTxs = await this.getTransactionsFromAddress(changeAddress.address);
      if (!changeTxs.length) {
        unusedChangeAddresses.push(changeAddress);
      } else {
        changeAddresses.push(changeAddress);
        transactions = [...transactions, ...changeTxs];
      }

      if (!!!receiveTxs.length && !!!changeTxs.length) {
        gap = gap + 1;
      } else {
        gap = 0;
      }

      i = i + 1;
    }

    console.log(`(${account.id}): Finished deriving addresses and checking for transactions.`);
    return {
      receiveAddresses,
      changeAddresses,
      unusedReceiveAddresses,
      unusedChangeAddresses,
      transactions
    };
  }

  async getUtxosForAddresses(addresses: Address[]): Promise<UTXO[]> {
    const availableUtxos: UTXO[] = [];
    for (let i = 0; i < addresses.length; i++) {
      const { data: utxosFromBlockstream }: { data: UTXO[] } = await axios.get(
        blockExplorerAPIURL(
          `/address/${addresses[i].address}/utxo`,
          getUnchainedNetworkFromBjslibNetwork(this.network)
        )
      );
      for (let j = 0; j < utxosFromBlockstream.length; j++) {
        const utxo = utxosFromBlockstream[j];
        utxo.address = addresses[i];
        utxo.prevTxHex = await this.getTxHex(utxo.txid, this.network);
        availableUtxos.push(utxo);
      }
    }

    return availableUtxos;
  }

  async getTransactionsFromAddress(address: string): Promise<Transaction[]> {
    const { data: transactions } = await axios.get(
      blockExplorerAPIURL(
        `/address/${address}/txs`,
        getUnchainedNetworkFromBjslibNetwork(this.network)
      )
    );

    return transactions;
  }

  async getTxHex(txid: string, currentBitcoinNetwork: Network): Promise<string> {
    const { data: txHex } = await await axios.get(
      blockExplorerAPIURL(
        `/tx/${txid}/hex`,
        getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
      )
    );
    return txHex;
  }

  async isConfirmedTransaction(txId: string) {
    const { data } = await await axios.get(`https://blockstream.info/api/tx/${txId}/status`);
    if (!!data.confirmed) {
      return Promise.resolve(true);
    }
    throw new Error(`Transaction not confirmed (${txId})`);
  }
}
