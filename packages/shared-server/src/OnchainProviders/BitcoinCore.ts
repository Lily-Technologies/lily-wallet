import { Client, ClientOption, FetchedRawTransaction } from 'bitcoin-simple-rpc';
import { SocksProxyAgent } from 'socks-proxy-agent';
import BigNumber from 'bignumber.js';
import { bitcoinsToSatoshis } from 'unchained-bitcoin';

import { OnchainBaseProvider } from '.';

import { getAddressFromAccount, createMap } from '../utils/accountMap';

import { OnChainConfig, LilyOnchainAccount, FeeRates, UTXO, Address } from '@lily/types';

export const getMultisigDescriptor = async (
  client: any,
  config: OnChainConfig,
  isChange: boolean
) => {
  const descriptor = `wsh(sortedmulti(${
    config.quorum.requiredSigners
  },${config.extendedPublicKeys.map(
    (xpub) => `[${xpub.device.fingerprint}/48h/0h/0h/2h]${xpub.xpub}/${isChange ? '1' : '0'}/*`
  )}))`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
};

export const getWrappedDescriptor = async (
  client: any,
  config: OnChainConfig,
  isChange: boolean
) => {
  const descriptor = `sh(wpkh([${config.extendedPublicKeys[0].device.fingerprint}/49h/0h/0h]${
    config.extendedPublicKeys[0].xpub
  }/${isChange ? '1' : '0'}/*))`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
};

export const getSegwitDescriptor = async (
  client: any,
  config: OnChainConfig,
  isChange: boolean
) => {
  const descriptor = `wpkh([${config.extendedPublicKeys[0].device.fingerprint}/84h/0h/0h]${
    config.extendedPublicKeys[0].xpub
  }/${isChange ? '1' : '0'}/*)`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
};

export class BitcoinCoreProvider extends OnchainBaseProvider {
  client: Client;

  constructor(nodeConfig: ClientOption, testnet: boolean) {
    super('Bitcoin Core', testnet);

    if (nodeConfig.baseURL && nodeConfig.baseURL !== 'localhost') {
      this.setProvider('Custom Node');
    }

    if (nodeConfig.baseURL && nodeConfig.baseURL.includes('.onion')) {
      const proxyOptions = 'socks5h://127.0.0.1:9050';
      const httpsAgent = new SocksProxyAgent(proxyOptions);
      this.client = new Client({
        ...nodeConfig,
        httpAgent: httpsAgent
      });
    } else {
      this.client = new Client(nodeConfig);
    }
    // currentConfig.baseURL = `${currentConfig.baseURL}/wallet/lily${config.id}`;
    // await this.loadOrCreateWalletViaRPC(config, nodeClient);
  }

  async initialize() {
    try {
      const blockchainInfo = await this.client.getBlockchainInfo(); // if fails, go to catch case
      this.setCurrentBlockHeight(blockchainInfo.blocks);
      this.setInitialBlockDownload(blockchainInfo.initialblockdownload);
      this.setVerificationProgress(blockchainInfo.verificationprogress);
      this.setConnected(true);
    } catch (e) {
      this.setConnected(false);
      this.setCurrentBlockHeight(0);
      this.setInitialBlockDownload(false);
      this.setVerificationProgress(100);
    }
  }

  async getDataFromXPub(account: OnChainConfig): Promise<LilyOnchainAccount> {
    throw new Error('Method not implemented.');
  }

  async getDataFromMultisig(account: OnChainConfig): Promise<LilyOnchainAccount> {
    throw new Error('Method not implemented.');
    // const {
    //   receiveAddresses,
    //   changeAddresses,
    //   unusedReceiveAddresses,
    //   unusedChangeAddresses,
    //   transactions,
    // } = await this.scanForAddressesAndTransactions(account, 10);

    // console.log(`(${account.id}): Serializing transactions from node...`);
    // const organizedTransactionsFromNode =
    //   await this.serializeTransactionsFromNode(transactions);

    // console.log(`(${account.id}): re-serializing (test...)...`);
    // const organizedTransactions = serializeTransactions(
    //   organizedTransactionsFromNode,
    //   receiveAddresses,
    //   changeAddresses
    // );

    // console.log(`(${account.id}): Getting UTXO data from node...`);
    // const availableUtxos = await this.getUtxosFromNode(
    //   receiveAddresses,
    //   changeAddresses
    // );

    // console.log(`Calculating current balance for ${account.id}`);
    // const currentBalance = availableUtxos.reduce(
    //   (accum, utxo) => accum.plus(utxo.value),
    //   new BigNumber(0)
    // );

    // const { scanning } = await this.client.getWalletInfo();
    // // TODO: should check if keypool is > 0
    // const loading = !!scanning;

    // return {
    //   loading,
    //   name: account.name,
    //   config: account,
    //   addresses: receiveAddresses,
    //   changeAddresses,
    //   transactions: organizedTransactions,
    //   unusedAddresses: unusedReceiveAddresses,
    //   unusedChangeAddresses,
    //   availableUtxos,
    //   currentBalance: currentBalance.toNumber(),
    // };
  }

  getAccountData(account: OnChainConfig): Promise<LilyOnchainAccount> {
    throw new Error('Method not implemented.');
  }

  async broadcastTransaction(txHex: string): Promise<string> {
    await this.client.sendRawTransaction(txHex);
    return txHex;
  }

  async estimateFee(): Promise<FeeRates> {
    try {
      const feeRates = {
        fastestFee: 0,
        halfHourFee: 0,
        hourFee: 0
      } as FeeRates;

      const fastestFeeRate = await this.client.estimateSmartFee(1);
      if (fastestFeeRate.feerate) {
        feeRates.fastestFee = new BigNumber(fastestFeeRate.feerate)
          .multipliedBy(100000)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(); // TODO: this probably needs relooked at
      }
      const halfHourFeeRate = await this.client.estimateSmartFee(3);
      if (halfHourFeeRate.feerate) {
        feeRates.halfHourFee = new BigNumber(halfHourFeeRate.feerate)
          .multipliedBy(100000)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(); // TODO: this probably needs relooked at
      }
      const hourFeeRate = await this.client.estimateSmartFee(6);
      if (hourFeeRate.feerate) {
        feeRates.hourFee = new BigNumber(hourFeeRate.feerate)
          .multipliedBy(100000)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(); // TODO: this probably needs relooked at
      }
      return Promise.resolve(feeRates);
    } catch (e) {
      console.log(`error /estimate-fee ${e}`);
      return Promise.reject(new Error('Error retrieving fee'));
    }
  }

  async serializeTransactionsFromNode(transactions: FetchedRawTransaction[]) {
    throw new Error('Method not implemented.');
    // transactions.sort((a, b) => a.blocktime - b.blocktime!);

    // let currentAccountTotal = new BigNumber(0);
    // const decoratedTxArray = [];
    // for (let i = 0; i < transactions.length; i++) {
    //   try {
    //     const currentTransaction = await this.client.getTransaction(
    //       transactions[i].txid, //txid
    //       true, // include_watchonly
    //       true // verbose
    //     );

    //     currentAccountTotal = currentAccountTotal.plus(
    //       bitcoinsToSatoshis(currentTransaction.details[0].amount)
    //     );

    //     const decoratedTx = {
    //       txid: currentTransaction.txid,
    //       version: currentTransaction.decoded.version,
    //       locktime: currentTransaction.decoded.locktime,
    //       value: bitcoinsToSatoshis(currentTransaction.details[0].amount)
    //         .abs()
    //         .toNumber(),
    //       address: currentTransaction.details[0].address, // KBC-TODO: this should probably be a bitcoinjs-lib object
    //       type:
    //         currentTransaction.details[0].category === "receive"
    //           ? "received"
    //           : "sent",
    //       totalValue: currentAccountTotal.toNumber(),
    //       vin: await Promise.all(
    //         currentTransaction.decoded.vin.map(async (item) => {
    //           const prevoutTx = (await this.client.getRawTransaction(
    //             item.txid, // txid
    //             true // verbose
    //           )) as FetchedRawTransaction;
    //           return {
    //             txid: item.txid,
    //             vout: item.vout,
    //             prevout: {
    //               scriptpubkey: prevoutTx.vout[item.vout].scriptPubKey.hex,
    //               scriptpubkey_asm: prevoutTx.vout[item.vout].scriptPubKey.asm,
    //               scriptpubkey_type:
    //                 prevoutTx.vout[item.vout].scriptPubKey.type,
    //               scriptpubkey_address:
    //                 prevoutTx.vout[item.vout].scriptPubKey.addresses[0],
    //               value: bitcoinsToSatoshis(prevoutTx.vout[item.vout].value)
    //                 .abs()
    //                 .toNumber(),
    //             },
    //             scriptsig: item.scriptSig.hex,
    //             scriptsig_asm: item.scriptSig.asm,
    //             witness: item.txinwitness,
    //             sequence: item.sequence,
    //           } as Vin;
    //         })
    //       ),
    //       vout: currentTransaction.decoded.vout.map(
    //         (item) =>
    //           ({
    //             scriptpubkey: item.scriptPubKey.hex,
    //             scriptpubkey_address: item.scriptPubKey.addresses[0],
    //             scriptpubkey_asm: item.scriptPubKey.asm,
    //             scriptpubkey_type: item.scriptPubKey.type,
    //             value: bitcoinsToSatoshis(item.value).abs().toNumber(),
    //           } as Vout)
    //       ),
    //       size: currentTransaction.decoded.size,
    //       weight: currentTransaction.decoded.weight,
    //       fee: bitcoinsToSatoshis(currentTransaction.fee).abs().toNumber(),
    //       status: {
    //         confirmed: currentTransaction.blockheight ? true : false,
    //         block_time: currentTransaction.blocktime,
    //         block_hash: currentTransaction.blockhash,
    //         block_height: currentTransaction.blockheight,
    //       },
    //     };

    //     // transactionWithValues.value = bitcoinsToSatoshis(
    //     //   currentTransaction.details[0].amount
    //     // )
    //     //   .abs()
    //     //   .toNumber();
    //     // transactionWithValues.address = currentTransaction.details[0].address;
    //     // transactionWithValues.type =
    //     //   currentTransaction.details[0].category === "receive"
    //     //     ? "received"
    //     //     : "sent";
    //     // transactionWithValues.totalValue = currentAccountTotal.toNumber();

    //     // transactionWithValues.status = {
    //     //   block_time: currentTransaction.blocktime,
    //     //   block_height: currentTransaction.blockheight,
    //     //   confirmed: true, // TODO: change later
    //     // };
    //     decoratedTxArray.push(decoratedTx);
    //   } catch (e) {
    //     console.log("e: ", e);
    //   }
    // }

    // decoratedTxArray.sort((a, b) => b.status.block_time - a.status.block_time);
    // return decoratedTxArray;
  }

  async scanForAddressesAndTransactions(account: OnChainConfig, limitGap: number) {
    console.log(`(${account.id}): Deriving addresses and checking for transactions...`);
    const receiveAddresses: Address[] = [];
    const changeAddresses: Address[] = [];
    let transactions: FetchedRawTransaction[] = [];

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

  async getTransactionsFromAddress(address: string) {
    let addressTxs: FetchedRawTransaction[] = [];
    const txIds = await this.client.listReceivedByAddress(
      0, // minconf
      true, // include_empty
      true, // include_watchonly
      address // address_filter
    );
    const numTxIds = txIds[0]?.txids?.length || 0;
    for (let i = 0; i < numTxIds; i++) {
      const tx = (await this.client.getRawTransaction(
        txIds[0].txids[i],
        true
      )) as FetchedRawTransaction; // txid, verbose
      addressTxs.push(tx);
    }
    return addressTxs;
  }

  async getUtxosFromNode(receiveAddresses: any[], changeAddresses: any[]) {
    const availableUtxos = await this.client.listUnspent();
    const receiveAddressMap = createMap(receiveAddresses, 'address');
    const changeAddressMap = createMap(changeAddresses, 'address');
    const addressMap = { ...receiveAddressMap, ...changeAddressMap };
    const decoratedUtxos: UTXO[] = [];
    for (let i = 0; i < availableUtxos.length; i++) {
      const utxoValue = bitcoinsToSatoshis(availableUtxos[i].amount).toNumber();
      const { hex: prevTxHex } = (await this.client.getRawTransaction(
        availableUtxos[i].txid,
        true
      )) as FetchedRawTransaction;

      const utxoAddress = addressMap[availableUtxos[i].address];

      decoratedUtxos.push({
        ...availableUtxos[i],
        value: utxoValue,
        prevTxHex,
        address: utxoAddress,
        status: {
          // TODO: make these real values
          confirmed: true,
          block_height: 0,
          block_hash: 'abc123',
          block_time: 0
        }
      });
    }
    return decoratedUtxos;
  }

  async isConfirmedTransaction(txId: string) {
    const transaction = (await this.client.getRawTransaction(txId, true)) as FetchedRawTransaction;
    if (transaction.confirmations > 0) {
      return Promise.resolve(true);
    }
    throw new Error(`Transaction not confirmed (${txId})`);
  }

  async loadOrCreateWalletViaRPC(config: OnChainConfig, nodeClient: any) {
    const walletList = await nodeClient.listWallets();
    console.log('walletList: ', walletList);

    if (!walletList.includes(`lily${config.id}`)) {
      console.log(`Wallet lily${config.id} isn't loaded.`);
      try {
        console.log(`Attempting to load lily${config.id}...`);
        const walletResp = await nodeClient.loadWallet(
          `lily${config.id}` // filename
        );
      } catch (e) {
        console.log(`Couldn't load lily${config.id}...`);
        console.log(`Creating lily${config.id}...`);
        // if failed to load wallet, then probably doesnt exist so let's create one and import
        await nodeClient.createWallet(
          `lily${config.id}`, // wallet_name
          true, // disable_private_keys
          true, //blank
          '', // passphrase
          true // avoid_reuse
        );
        if (config.quorum.totalSigners === 1) {
          if (config.addressType === 'p2sh') {
            console.log(`Importing ${config.addressType} addresses...`);
            await nodeClient.importMulti(
              [
                {
                  desc: await getWrappedDescriptor(nodeClient, config, false),
                  range: [0, 1000],
                  timestamp: 1503446400,
                  internal: false,
                  watchonly: true,
                  keypool: true
                },
                {
                  desc: await getWrappedDescriptor(nodeClient, config, true),
                  range: [0, 1000],
                  timestamp: 1503446400,
                  internal: false,
                  watchonly: true,
                  keypool: true
                }
              ],
              {
                rescan: true
              }
            );
          } else {
            console.log(`Importing ${config.addressType} addresses...`);
            await nodeClient.importMulti(
              [
                {
                  desc: await getSegwitDescriptor(nodeClient, config, false),
                  range: [0, 1000],
                  timestamp: 1503446400,
                  internal: false,
                  watchonly: true,
                  keypool: true
                },
                {
                  desc: await getSegwitDescriptor(nodeClient, config, true),
                  range: [0, 1000],
                  timestamp: 1503446400,
                  internal: false,
                  watchonly: true,
                  keypool: true
                }
              ],
              {
                rescan: true
              }
            );
          }
        } else {
          console.log(`Importing ${config.addressType} addresses...`);
          // multisig
          //  import receive addresses
          await nodeClient.importMulti(
            [
              {
                desc: await getMultisigDescriptor(nodeClient, config, false),
                range: [0, 1000],
                timestamp: 1503446400,
                internal: false,
                watchonly: true,
                keypool: true
              },
              {
                desc: await getMultisigDescriptor(nodeClient, config, true),
                range: [0, 1000],
                timestamp: 1503446400,
                internal: false,
                watchonly: true,
                keypool: true
              }
            ],
            {
              rescan: true
            }
          );
        }
      }
    }
  }
}
