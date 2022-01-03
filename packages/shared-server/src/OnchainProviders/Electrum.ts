import ElectrumClient, {
  JSONRPCParamResponse,
  blockchainTransaction_getBatchResponse,
  ElectrumVin,
  blockchainScripthash_listunspentBatch
} from '@lily-technologies/electrum-client';
import { address as bitcoinjsAddress, crypto as bitcoinjsCrypto } from 'bitcoinjs-lib';
import { bitcoinsToSatoshis } from 'unchained-bitcoin';

import { OnchainBaseProvider } from '.';

import { getAddressFromAccount, serializeTransactions } from '../utils/accountMap';

import {
  LilyOnchainAccount,
  FeeRates,
  OnChainConfig,
  Address,
  ElectrumTxToEsploraTx,
  EsploraTransactionResponse,
  UTXO
} from '@lily/types';

const sortAddress = (a: Address, b: Address) => {
  const aPath = a.bip32derivation[0].path;
  const bPath = b.bip32derivation[0].path;

  const aIndex = aPath.substring(aPath.lastIndexOf('/') + 1);
  const bIndex = bPath.substring(bPath.lastIndexOf('/') + 1);

  const result = Number(aIndex) - Number(bIndex);
  return result;
};

const getScriptHash = (address: string) => {
  const script = bitcoinjsAddress.toOutputScript(address);
  const hash = bitcoinjsCrypto.sha256(script);
  const reversedHash = Buffer.from(hash.reverse());
  return reversedHash.toString('hex');
};

const createTxMap = (response: JSONRPCParamResponse<blockchainTransaction_getBatchResponse>[]) => {
  const txMap: { [txid: string]: blockchainTransaction_getBatchResponse } = {};
  response.forEach((txResp) => {
    txMap[txResp.result.txid] = txResp.result;
  });
  return txMap;
};

const getPrevOut = (prevTx: blockchainTransaction_getBatchResponse, index: number) => {
  const output = prevTx.vout[index];
  return {
    scriptpubkey_address: output.scriptPubKey.addresses[0],
    value: bitcoinsToSatoshis(output.value)
  };
};

export class ElectrumProvider extends OnchainBaseProvider {
  client: ElectrumClient;

  constructor(url: string, port: number, testnet: boolean) {
    super('Electrum', testnet);
    this.client = new ElectrumClient(port, url, 'tcp');
  }

  async initialize() {
    try {
      const ver = await this.client.initElectrum({
        client: 'bluewallet',
        version: '1.4'
      });

      const blockheight = await this.client.blockchainHeaders_subscribe();
      console.log('blockheight: ', blockheight);

      this.setCurrentBlockHeight(blockheight.height);
      this.setConnected(true);
    } catch (e) {
      console.log('e: ', e);
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
      transactions,
      utxos
    } = await this.scanForAddressesAndTransactions(account, 10);

    const currentBalance = utxos.reduce((acum, cur) => acum + cur.value, 0);

    console.log(`(${account.id}): Serializing transactions...`);
    const organizedTransactions = serializeTransactions(
      transactions,
      receiveAddresses,
      changeAddresses
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
      availableUtxos: utxos,
      currentBalance: currentBalance
    };
  }

  async broadcastTransaction(txHex: string): Promise<string> {
    let txHash = '';
    try {
      txHash = await this.client.blockchainTransaction_broadcast(txHex);
    } catch (e) {
      console.log('broadcastTransaction e: ', e);
    }
    return txHash;
  }

  async estimateFee(): Promise<FeeRates> {
    const feeRates = {
      fastestFee: 0,
      halfHourFee: 0,
      hourFee: 0
    } as FeeRates;
    try {
      // TODO: electrum returns totals, not sat/vbyte as expected from mempool (https://electrumx-spesmilo.readthedocs.io/en/latest/protocol-methods.html#blockchain-estimatefee)
      // TODO: better optimize this / fees in general
      (feeRates.fastestFee = Math.ceil(
        bitcoinsToSatoshis(await this.client.blockchainEstimatefee(1)).toNumber() / 5000
      )),
        (feeRates.halfHourFee = Math.ceil(
          bitcoinsToSatoshis(await this.client.blockchainEstimatefee(3)).toNumber() / 5000
        )),
        (feeRates.hourFee = Math.ceil(
          bitcoinsToSatoshis(await this.client.blockchainEstimatefee(6)).toNumber() / 5000
        ));
    } catch (e) {
      console.log('estimateFee e: ', e);
    }
    return feeRates;
  }

  async isConfirmedTransaction(txId: string): Promise<boolean> {
    const response = await this.client.blockchainTransaction_get(txId, true);
    if (response.confirmations > 0) return true;
    return false;
  }

  async scanForAddressesAndTransactions(account: OnChainConfig, limitGap: number) {
    console.log(`(${account.id}): Deriving addresses and checking for transactions...`);
    const receiveAddresses: Address[] = [];
    const changeAddresses: Address[] = [];
    const transactions: EsploraTransactionResponse[] = [];
    const utxos: UTXO[] = [];

    const unusedReceiveAddresses: Address[] = [];
    const unusedChangeAddresses: Address[] = [];

    let receiveGap = 0;
    let changeGap = 0;
    let cycles = 0;
    const BATCH_SIZE = 10;
    while (receiveGap < limitGap || changeGap < limitGap) {
      try {
        let currentReceiveAddressBatch: Address[] = [];
        let currentChangeAddressBatch: Address[] = [];
        let scriptHashesWithHistory: string[] = [];
        let txIdsWithHistory: string[] = [];
        const pos = cycles * BATCH_SIZE;
        // derive a batch of receive/change addresses
        for (let i = pos; i < pos + BATCH_SIZE; i++) {
          const receiveAddress = getAddressFromAccount(account, `m/0/${i}`, this.network);
          currentReceiveAddressBatch.push(receiveAddress);

          const changeAddress = getAddressFromAccount(account, `m/1/${i}`, this.network);
          currentChangeAddressBatch.push(changeAddress);
        }

        // keep track of the scriptHash => address pairings
        const currentReceiveScriptHashBatch: string[] = [];
        const scriptHashToAddressMap: { [scriptHash: string]: Address } = {};
        currentReceiveAddressBatch.forEach((item) => {
          const scriptHash = getScriptHash(item.address);
          currentReceiveScriptHashBatch.push(scriptHash);
          scriptHashToAddressMap[scriptHash] = item;
        });

        const currentChangeScriptHashBatch: string[] = [];
        currentChangeAddressBatch.forEach((item) => {
          const scriptHash = getScriptHash(item.address);
          currentChangeScriptHashBatch.push(scriptHash);
          scriptHashToAddressMap[scriptHash] = item;
        });

        // if gap limit isn't hit (this saves unnecessary network requests)
        if (receiveGap < limitGap) {
          // get balance history for receive addresses
          const recieveHistory = await this.client.blockchainScripthash_getHistoryBatch(
            currentReceiveScriptHashBatch
          );

          // sort receive addresses into used/unused buckets
          recieveHistory.forEach((item) => {
            if (item.result.length > 0) {
              receiveAddresses.push(scriptHashToAddressMap[item.param]);
              scriptHashesWithHistory.push(item.param);
              txIdsWithHistory.push(...item.result.map((item) => item.tx_hash));
              receiveGap = 0;
            } else {
              unusedReceiveAddresses.push(scriptHashToAddressMap[item.param]);
              receiveGap = receiveGap + 1;
            }
          });
        }

        // if gap limit isn't hit (this saves unnecessary network requests)
        if (changeGap < limitGap) {
          // get balance history for change addresses
          const changeHistory = await this.client.blockchainScripthash_getHistoryBatch(
            currentChangeScriptHashBatch
          );

          // sort change addresses into used/unused buckets
          changeHistory.forEach((item) => {
            if (item.result.length > 0) {
              changeAddresses.push(scriptHashToAddressMap[item.param]);
              scriptHashesWithHistory.push(item.param);
              txIdsWithHistory.push(...item.result.map((item) => item.tx_hash));
              changeGap = 0;
            } else {
              unusedChangeAddresses.push(scriptHashToAddressMap[item.param]);
              changeGap = changeGap + 1;
            }
          });
        }

        let txHexMap = {} as { [txId: string]: string };
        if (txIdsWithHistory.length) {
          const rawTxs = await this.client.blockchainTransaction_getBatch(txIdsWithHistory, true);

          rawTxs.forEach((tx) => {
            txHexMap[tx.param] = tx.result.hex;
          });

          const decoratedTxs = await this.decorateTxs(rawTxs);
          transactions.push(...decoratedTxs);
        }

        if (scriptHashesWithHistory.length) {
          const rawUtxos = await this.client.blockchainScripthash_listunspentBatch(
            scriptHashesWithHistory
          );

          const decoratedUtxos = this.decorateUtxos(rawUtxos, scriptHashToAddressMap, txHexMap);

          utxos.push(...decoratedUtxos);
        }

        cycles = cycles + 1;
      } catch (e) {
        console.log('scanForAddressesAndTransactions e: ', e);
        await this.initialize();
      }
    }

    // electrum doesn't return batch calls in same order as was received,
    // so sort by derivation path
    receiveAddresses.sort((a, b) => sortAddress(a, b));
    changeAddresses.sort((a, b) => sortAddress(a, b));
    unusedReceiveAddresses.sort((a, b) => sortAddress(a, b));
    unusedChangeAddresses.sort((a, b) => sortAddress(a, b));

    return {
      receiveAddresses,
      changeAddresses,
      unusedReceiveAddresses,
      unusedChangeAddresses,
      transactions,
      utxos
    };
  }

  decorateUtxos(
    utxoResponse: JSONRPCParamResponse<blockchainScripthash_listunspentBatch[]>[],
    scriptHashToAddressMap: { [scriptHash: string]: Address } = {},
    txMap: { [txId: string]: string }
  ) {
    return utxoResponse.reduce((acc, cur) => {
      return acc.concat(
        cur.result.map((item) => {
          const decoratedUtxo: UTXO = {
            txid: item.tx_hash,
            value: item.value,
            vout: item.tx_pos,
            address: scriptHashToAddressMap[cur.param],
            prevTxHex: txMap[item.tx_hash], // TODO: find this
            status: {
              confirmed: !!item.height,
              block_height: item.height,
              block_hash: undefined, // TODO: find this?
              block_time: undefined // TODO: find this?
            }
          };

          return decoratedUtxo;
        })
      );
    }, [] as UTXO[]);
  }

  async decorateTxs(txsResponse: JSONRPCParamResponse<blockchainTransaction_getBatchResponse>[]) {
    const vins = txsResponse.reduce((acc, cur) => {
      return acc.concat(cur.result.vin);
    }, [] as ElectrumVin[]);

    const prevOuts = await this.getPrevOutTxs(vins);

    const decoratedTxs: EsploraTransactionResponse[] = [];
    txsResponse.forEach((tx) => {
      const electrumTxDecorated = {
        ...tx.result,
        vin: tx.result.vin.map((vin) => {
          return {
            ...vin,
            prevout: getPrevOut(prevOuts[vin.txid], vin.vout),
            witness: vin.txinwitness
          };
        }),
        vout: tx.result.vout.map((vout) => {
          return {
            scriptpubkey_address: vout.scriptPubKey.addresses[0],
            value: bitcoinsToSatoshis(vout.value).toNumber()
          };
        }),
        status: {
          confirmed: tx.result.confirmations > 0,
          block_height: tx.result.confirmations, // TODO: need to subtract current blockheight from confirmations
          block_hash: tx.result.blockhash,
          block_time: tx.result.blocktime
        }
      };

      const electrumTxWithFee = {
        ...electrumTxDecorated,
        fee: this.getFee(electrumTxDecorated)
      };

      decoratedTxs.push(electrumTxWithFee);
    });

    return decoratedTxs;
  }

  async getPrevOutTxs(vins: ElectrumVin[]) {
    const txIds = vins.map((vin) => vin.txid);
    const rawTxs = await this.client.blockchainTransaction_getBatch(txIds, true);

    const txMap = createTxMap(rawTxs);
    return txMap;
  }

  getFee(tx: ElectrumTxToEsploraTx) {
    const inputTotal = tx.vin.reduce((accum, curVin) => accum + curVin.prevout.value, 0);

    // TODO: remove "as" cast
    const outputTotal = (tx as blockchainTransaction_getBatchResponse).vout.reduce(
      (accum, curVout) => accum + curVout.value,
      0
    );

    return inputTotal - outputTotal;
  }
}
