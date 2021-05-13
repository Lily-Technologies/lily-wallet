import axios from "axios";
import BigNumber from "bignumber.js";
import { payments, networks, Network } from "bitcoinjs-lib";
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  generateMultisigFromPublicKeys,
  bitcoinsToSatoshis,
} from "unchained-bitcoin";

import {
  AccountConfig,
  Address,
  AddressType,
  AddressMap,
  UTXO,
  Vin,
  Vout,
  Transaction,
  TransactionType,
  TransactionMap,
  PubKey,
  ExtendedPublicKey,
  BitcoinCoreGetTransactionResponse,
  BitcoinCoreGetRawTransactionResponse,
} from "../types";

export const bitcoinNetworkEqual = (a: Network, b: Network): boolean => {
  return a.bech32 === b.bech32;
};

function isVout(item: Vin | Vout): item is Vout {
  return (item as Vout).value !== undefined;
}

export const getDerivationPath = (
  addressType: AddressType,
  bip32Path: string,
  currentBitcoinNetwork: Network
) => {
  const childPubKeysBip32Path = bip32Path;
  if (addressType === "multisig") {
    return `${getMultisigDeriationPathForNetwork(
      currentBitcoinNetwork
    )}/${childPubKeysBip32Path.replace("m/", "")}`;
  } else if (addressType === "p2sh") {
    return `${getP2shDeriationPathForNetwork(
      currentBitcoinNetwork
    )}/${childPubKeysBip32Path.replace("m/", "")}`;
  } else {
    // p2wpkh
    return `${getP2wpkhDeriationPathForNetwork(
      currentBitcoinNetwork
    )}/${childPubKeysBip32Path.replace("m/", "")}`;
  }
};

const getMultisigDeriationPathForNetwork = (network: Network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/48'/0'/0'/2'";
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/48'/1'/0'/2'";
  } else {
    // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'";
  }
};

const getP2shDeriationPathForNetwork = (network: Network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/49'/0'/0'";
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/49'/1'/0'";
  } else {
    // return mainnet by default...this should never run though
    return "m/49'/0'/0'";
  }
};

const getP2wpkhDeriationPathForNetwork = (network: Network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/84'/0'/0'";
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/84'/1'/0'";
  } else {
    // return mainnet by default...this should never run though
    return "m/84'/0'/0'";
  }
};

const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork: Network) => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return "mainnet";
  } else {
    return "testnet";
  }
};

export const getMultisigDescriptor = async (
  client: any,
  config: AccountConfig,
  isChange: boolean
) => {
  const descriptor = `wsh(sortedmulti(${
    config.quorum.requiredSigners
  },${config.extendedPublicKeys.map(
    (xpub) =>
      `[${xpub.device.fingerprint}/48h/0h/0h/2h]${xpub.xpub}/${
        isChange ? "1" : "0"
      }/*`
  )}))`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
};

export const getWrappedDescriptor = async (
  client: any,
  config: AccountConfig,
  isChange: boolean
) => {
  const descriptor = `sh(wpkh([${
    config.extendedPublicKeys[0].device.fingerprint
  }/49h/0h/0h]${config.extendedPublicKeys[0].xpub}/${isChange ? "1" : "0"}/*))`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
};

export const getSegwitDescriptor = async (
  client: any,
  config: AccountConfig,
  isChange: boolean
) => {
  const descriptor = `wpkh([${
    config.extendedPublicKeys[0].device.fingerprint
  }/84h/0h/0h]${config.extendedPublicKeys[0].xpub}/${isChange ? "1" : "0"}/*)`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
};

const createAddressMapFromAddressArray = (
  addressArray: Address[],
  isChange: boolean
) => {
  const addressMap: AddressMap = {};
  addressArray.forEach((addr) => {
    addressMap[addr.address!] = { ...addr, isChange: !!isChange };
  });
  return addressMap;
};

const getTxHex = async (txid: string, currentBitcoinNetwork: Network) => {
  const txHex = await (
    await axios.get(
      blockExplorerAPIURL(
        `/tx/${txid}/hex`,
        getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
      )
    )
  ).data;
  return txHex;
};

/**
 * Function used to aggregate values of inputs/outputs with optional
 * filtering options.
 *
 * @param {Array} items - Array of either inputs or outputs.
 * @param {Boolean} isMine - Whether to restrict sum to our own inputs/outputs.
 * @param {Boolean} isChange - Whether to restrict sum to change inputs/outputs.
 */
const sum = (items: (Vin | Vout)[], isMine: boolean, isChange?: boolean) => {
  let filtered = items;
  if (typeof isMine === "boolean")
    filtered = filtered.filter((item) => item.isMine === isMine);
  if (typeof isChange === "boolean")
    filtered = filtered.filter((item) => item.isChange === isChange);
  let total = filtered.reduce((accum: number, item: Vin | Vout) => {
    if (isVout(item)) {
      return accum + item.value;
    } else {
      return accum + item.prevout.value;
    }
  }, 0);
  return total;
};

/**
 * Function used to add 'isMine' & 'isChange' decoration markers
 * to inputs & outputs.
 *
 * @param {Object} tx - A raw transaction.
 * @param {Map} externalMap - Map of external addresses.
 * @param {Map} changeMap - Map of change addresses.
 */
const decorateTx = (
  tx: Transaction,
  externalMap: AddressMap,
  changeMap: AddressMap
) => {
  tx.vin.forEach((vin, index) => {
    const isChange = !!changeMap[vin.prevout.scriptpubkey_address];
    const isMine = isChange || !!externalMap[vin.prevout.scriptpubkey_address];
    tx.vin[index] = { ...vin, isChange: isChange, isMine: isMine };
  });
  tx.vout.forEach((vout, index) => {
    const isChange = !!changeMap[vout.scriptpubkey_address];
    const isMine = isChange || !!externalMap[vout.scriptpubkey_address];
    tx.vout[index] = { ...vout, isChange: isChange, isMine: isMine };
  });
  return tx;
};

export const serializeTransactions = (
  transactionsFromBlockstream: Transaction[],
  addresses: Address[],
  changeAddresses: Address[]
): Transaction[] => {
  transactionsFromBlockstream.sort(
    (a, b) => a.status.block_time - b.status.block_time
  );

  const addressesMap = createAddressMapFromAddressArray(addresses, false);
  const changeAddressesMap = createAddressMapFromAddressArray(
    changeAddresses,
    true
  );
  const txMap: TransactionMap = {};
  const txs = transactionsFromBlockstream
    .map((tx) => decorateTx(tx, addressesMap, changeAddressesMap))
    .filter((tx) => {
      if (!txMap[tx.txid]) {
        txMap[tx.txid] = tx;
        return true;
      }
      return false;
    });

  let balance = 0;
  txs.forEach((tx) => {
    let amountIn, amountOut, amountOutChange;
    amountIn = sum(tx.vin, true);
    amountOut = sum(tx.vout, true);
    amountOutChange = sum(tx.vout, true, true);
    if (amountIn === amountOut + (amountIn > 0 ? tx.fee : 0)) {
      tx.type = TransactionType.moved;
      tx.address = "";
      balance -= tx.fee;
      tx.totalValue = balance;
      tx.address = tx.vout.filter(
        (vout) => vout.isChange
      )[0].scriptpubkey_address;
      tx.value = tx.vout.reduce((accum, item) => accum + item.value, 0);
    } else {
      const feeContribution = amountIn > 0 ? tx.fee : 0;
      const netAmount = amountIn - amountOut - feeContribution;
      tx.type = netAmount > 0 ? TransactionType.sent : TransactionType.received;
      if (tx.type === "sent") {
        balance -= amountIn - amountOutChange + feeContribution;
        tx.totalValue = balance;
        tx.address = tx.vout.filter(
          (vout) => !vout.isMine
        )[0].scriptpubkey_address;
        tx.value = tx.vout
          .filter((vout) => !vout.isMine)
          .reduce((accum, item) => accum + item.value, 0);
      } else {
        balance += amountOut;
        tx.totalValue = balance;
        tx.address = tx.vout.filter(
          (vout) => vout.isMine
        )[0].scriptpubkey_address;
        tx.value = tx.vout
          .filter((vout) => vout.isMine)
          .reduce((accum, item) => accum + item.value, 0);
      }
    }
  });
  return txs.sort((a, b) => b.status.block_time - a.status.block_time);
};

const serializeTransactionsFromNode = async (
  nodeClient: any,
  transactions: BitcoinCoreGetRawTransactionResponse[]
) => {
  transactions.sort((a, b) => a.blocktime - b.blocktime!);

  let currentAccountTotal = new BigNumber(0);
  const decoratedTxArray = [];
  for (let i = 0; i < transactions.length; i++) {
    try {
      const currentTransaction = (await nodeClient.getTransaction(
        transactions[i].txid, //txid
        true, // include_watchonly
        true // verbose
      )) as BitcoinCoreGetTransactionResponse;

      currentAccountTotal = currentAccountTotal.plus(
        bitcoinsToSatoshis(currentTransaction.details[0].amount)
      );

      const decoratedTx = {
        txid: currentTransaction.txid,
        version: currentTransaction.decoded.version,
        locktime: currentTransaction.decoded.locktime,
        value: bitcoinsToSatoshis(currentTransaction.details[0].amount)
          .abs()
          .toNumber(),
        address: currentTransaction.details[0].address, // KBC-TODO: this should probably be a bitcoinjs-lib object
        type:
          currentTransaction.details[0].category === "receive"
            ? "received"
            : "sent",
        totalValue: currentAccountTotal.toNumber(),
        vin: await Promise.all(
          currentTransaction.decoded.vin.map(async (item) => {
            const prevoutTx = (await nodeClient.getRawTransaction(
              item.txid, // txid
              true // verbose
            )) as BitcoinCoreGetRawTransactionResponse;
            return {
              txid: item.txid,
              vout: item.vout,
              prevout: {
                scriptpubkey: prevoutTx.vout[item.vout].scriptPubKey.hex,
                scriptpubkey_asm: prevoutTx.vout[item.vout].scriptPubKey.asm,
                scriptpubkey_type: prevoutTx.vout[item.vout].scriptPubKey.type,
                scriptpubkey_address:
                  prevoutTx.vout[item.vout].scriptPubKey.addresses[0],
                value: bitcoinsToSatoshis(prevoutTx.vout[item.vout].value)
                  .abs()
                  .toNumber(),
              },
              scriptsig: item.scriptSig.hex,
              scriptsig_asm: item.scriptSig.asm,
              witness: item.txinwitness,
              sequence: item.sequence,
            } as Vin;
          })
        ),
        vout: currentTransaction.decoded.vout.map(
          (item) =>
            ({
              scriptpubkey: item.scriptPubKey.hex,
              scriptpubkey_address: item.scriptPubKey.addresses[0],
              scriptpubkey_asm: item.scriptPubKey.asm,
              scriptpubkey_type: item.scriptPubKey.type,
              value: bitcoinsToSatoshis(item.value).abs().toNumber(),
            } as Vout)
        ),
        size: currentTransaction.decoded.size,
        weight: currentTransaction.decoded.weight,
        fee: bitcoinsToSatoshis(currentTransaction.fee).abs().toNumber(),
        status: {
          confirmed: currentTransaction.blockheight ? true : false,
          block_time: currentTransaction.blocktime,
          block_hash: currentTransaction.blockhash,
          block_height: currentTransaction.blockheight,
        },
      };

      // transactionWithValues.value = bitcoinsToSatoshis(
      //   currentTransaction.details[0].amount
      // )
      //   .abs()
      //   .toNumber();
      // transactionWithValues.address = currentTransaction.details[0].address;
      // transactionWithValues.type =
      //   currentTransaction.details[0].category === "receive"
      //     ? "received"
      //     : "sent";
      // transactionWithValues.totalValue = currentAccountTotal.toNumber();

      // transactionWithValues.status = {
      //   block_time: currentTransaction.blocktime,
      //   block_height: currentTransaction.blockheight,
      //   confirmed: true, // TODO: change later
      // };
      decoratedTxArray.push(decoratedTx);
    } catch (e) {
      console.log("e: ", e);
    }
  }

  decoratedTxArray.sort((a, b) => b.status.block_time - a.status.block_time);
  return decoratedTxArray;
};

const getChildPubKeyFromXpub = (
  xpub: ExtendedPublicKey,
  bip32Path: string,
  currentBitcoinNetwork: Network
) => {
  const childPubKeysBip32Path = bip32Path;
  let bip32derivationPath = `${xpub.bip32Path}/${bip32Path.replace("m/", "")}`;

  return {
    childPubKey: deriveChildPublicKey(
      xpub.xpub!,
      childPubKeysBip32Path,
      getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
    ),
    bip32derivation: {
      masterFingerprint: Buffer.from(xpub.parentFingerprint as string, "hex"),
      pubkey: Buffer.from(
        deriveChildPublicKey(
          xpub.xpub!,
          childPubKeysBip32Path,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        ),
        "hex"
      ),
      path: bip32derivationPath,
    },
  };
};

const getMultisigAddressFromPubKeys = (
  pubkeys: PubKey[],
  config: AccountConfig,
  currentBitcoinNetwork: Network
) => {
  const rawPubkeys = pubkeys.map((publicKey) => publicKey.childPubKey);
  rawPubkeys.sort();

  const address = generateMultisigFromPublicKeys(
    getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    config.addressType,
    config.quorum.requiredSigners,
    ...rawPubkeys
  );
  address.bip32derivation = pubkeys.map(
    (publicKey) => publicKey.bip32derivation
  );
  return address;
};

const getUtxosFromNode = async (
  receiveAddresses: any[],
  changeAddresses: any[],
  nodeClient: any
) => {
  const availableUtxos = await nodeClient.listUnspent();
  const receiveAddressMap = createAddressMapFromAddressArray(
    receiveAddresses,
    false
  );
  const changeAddressMap = createAddressMapFromAddressArray(
    changeAddresses,
    true
  );
  const addressMap = { ...receiveAddressMap, ...changeAddressMap };
  for (let i = 0; i < availableUtxos.length; i++) {
    availableUtxos[i].value = bitcoinsToSatoshis(
      availableUtxos[i].amount
    ).toNumber();
    availableUtxos[i].prevTxHex = await nodeClient.getRawTransaction(
      availableUtxos[i].txid,
      true
    ).hex;
    availableUtxos[i].address = addressMap[availableUtxos[i].address as any];
  }
  return availableUtxos;
};

const getUtxosForAddresses = async (
  addresses: Address[],
  currentBitcoinNetwork: Network
) => {
  const availableUtxos = [];
  for (let i = 0; i < addresses.length; i++) {
    const utxosFromBlockstream = await (
      await axios.get(
        blockExplorerAPIURL(
          `/address/${addresses[i].address}/utxo`,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        )
      )
    ).data;
    for (let j = 0; j < utxosFromBlockstream.length; j++) {
      const utxo = utxosFromBlockstream[j];
      utxo.address = addresses[i];
      utxo.prevTxHex = await getTxHex(utxo.txid, currentBitcoinNetwork);
      availableUtxos.push(utxo);
    }
  }

  return availableUtxos;
};

const getAddressFromPubKey = (
  childPubKey: PubKey,
  addressType: AddressType,
  currentBitcoinNetwork: Network
): Address => {
  if (addressType === "p2sh") {
    const {
      network,
      address: _address,
      hash,
      output,
      redeem,
      input,
      witness,
    } = payments.p2sh({
      redeem: payments.p2wpkh({
        pubkey: Buffer.from(childPubKey.childPubKey, "hex"),
        network: currentBitcoinNetwork,
      }),
      network: currentBitcoinNetwork,
    });
    return {
      network: currentBitcoinNetwork,
      address: _address as string,
      hash,
      output,
      redeem,
      input,
      witness,
      bip32derivation: [childPubKey.bip32derivation],
    };
  } else {
    // p2wpkh
    const {
      network,
      address: _address,
      hash,
      output,
      redeem,
      input,
      witness,
    } = payments.p2wpkh({
      pubkey: Buffer.from(childPubKey.childPubKey, "hex"),
      network: currentBitcoinNetwork,
    });
    return {
      network: currentBitcoinNetwork,
      address: _address as string,
      hash,
      output,
      redeem,
      input,
      witness,
      bip32derivation: [childPubKey.bip32derivation],
    };
  }
};

const getTransactionsFromAddress = async (
  address: string,
  nodeClient: any,
  currentBitcoinNetwork: Network
) => {
  if (nodeClient) {
    let addressTxs = [];
    const txIds = await nodeClient.listReceivedByAddress(
      0, // minconf
      true, // include_empty
      true, // include_watchonly
      address // address_filter
    );
    const numTxIds = txIds[0]?.txids?.length || 0;
    for (let i = 0; i < numTxIds; i++) {
      const tx = await nodeClient.getRawTransaction(txIds[0].txids[i], true); // txid, verbose
      addressTxs.push(tx);
    }
    return addressTxs;
  } else {
    return await (
      await axios.get(
        blockExplorerAPIURL(
          `/address/${address}/txs`,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        )
      )
    ).data;
  }
};

export const getAddressFromAccount = (
  account: AccountConfig,
  path: string,
  currentBitcoinNetwork: Network
) => {
  if (account.quorum.totalSigners > 1) {
    // multisig
    if (account.extendedPublicKeys) {
      // should always be true
      const childPubKeys = account.extendedPublicKeys.map(
        (extendedPublicKey) => {
          return getChildPubKeyFromXpub(
            extendedPublicKey,
            path,
            currentBitcoinNetwork
          );
        }
      );
      return getMultisigAddressFromPubKeys(
        childPubKeys,
        account,
        currentBitcoinNetwork
      );
    }
  } else {
    // single sig
    const receivePubKey = getChildPubKeyFromXpub(
      account.extendedPublicKeys[0],
      path,
      currentBitcoinNetwork
    );
    return getAddressFromPubKey(
      receivePubKey,
      account.addressType,
      currentBitcoinNetwork
    );
  }
};

const scanForAddressesAndTransactions = async (
  account: AccountConfig,
  nodeClient: any,
  currentBitcoinNetwork: Network,
  limitGap: number
) => {
  console.log(
    `(${account.id}): Deriving addresses and checking for transactions...`
  );
  const receiveAddresses = [];
  const changeAddresses = [];
  let transactions: (Transaction | BitcoinCoreGetRawTransactionResponse)[] = [];

  const unusedReceiveAddresses = [];
  const unusedChangeAddresses = [];

  let gap = 0;
  let i = 0;

  while (gap < limitGap) {
    const receiveAddress = getAddressFromAccount(
      account,
      `m/0/${i}`,
      currentBitcoinNetwork
    );

    receiveAddresses.push(receiveAddress);
    const receiveTxs = await getTransactionsFromAddress(
      receiveAddress.address,
      nodeClient,
      currentBitcoinNetwork
    );
    if (!receiveTxs.length) {
      unusedReceiveAddresses.push(receiveAddress);
    } else {
      transactions = [...transactions, ...receiveTxs];
    }

    const changeAddress = getAddressFromAccount(
      account,
      `m/1/${i}`,
      currentBitcoinNetwork
    );
    changeAddresses.push(changeAddress);
    const changeTxs = await getTransactionsFromAddress(
      changeAddress.address,
      nodeClient,
      currentBitcoinNetwork
    );
    if (!changeTxs.length) {
      unusedChangeAddresses.push(changeAddress);
    } else {
      transactions = [...transactions, ...changeTxs];
    }

    if (!!!receiveTxs.length && !!!changeTxs.length) {
      gap = gap + 1;
    } else {
      gap = 0;
    }

    i = i + 1;
  }

  console.log(
    `(${account.id}): Finished deriving addresses and checking for transactions.`
  );
  return {
    receiveAddresses,
    changeAddresses,
    unusedReceiveAddresses,
    unusedChangeAddresses,
    transactions,
  };
};

export const getDataFromMultisig = async (
  account: AccountConfig,
  nodeClient: any,
  currentBitcoinNetwork: Network
) => {
  const {
    receiveAddresses,
    changeAddresses,
    unusedReceiveAddresses,
    unusedChangeAddresses,
    transactions,
  } = await scanForAddressesAndTransactions(
    account,
    nodeClient,
    currentBitcoinNetwork,
    10
  );
  let organizedTransactions: Transaction[];
  let availableUtxos: UTXO[];
  if (nodeClient) {
    console.log(`(${account.id}): Serializing transactions from node...`);
    organizedTransactions = (await serializeTransactionsFromNode(
      nodeClient,
      transactions as BitcoinCoreGetRawTransactionResponse[]
    )) as any;

    console.log(`(${account.id}): re-serializing (test...)...`);
    organizedTransactions = serializeTransactions(
      organizedTransactions,
      receiveAddresses,
      changeAddresses
    );

    console.log(`(${account.id}): Getting UTXO data from node...`);
    availableUtxos = await getUtxosFromNode(
      receiveAddresses,
      changeAddresses,
      nodeClient
    );
  } else {
    console.log(`(${account.id}): Serializing transactions...`);
    organizedTransactions = serializeTransactions(
      transactions as Transaction[],
      receiveAddresses,
      changeAddresses
    );

    console.log(`(${account.id}): Getting UTXO data...`);
    availableUtxos = await getUtxosForAddresses(
      receiveAddresses.concat(changeAddresses),
      currentBitcoinNetwork
    );
  }

  return [
    receiveAddresses,
    changeAddresses,
    organizedTransactions,
    unusedReceiveAddresses,
    unusedChangeAddresses,
    availableUtxos,
  ];
};

export const getDataFromXPub = async (
  account: AccountConfig,
  nodeClient: any,
  currentBitcoinNetwork: Network
) => {
  const {
    receiveAddresses,
    changeAddresses,
    unusedReceiveAddresses,
    unusedChangeAddresses,
    transactions,
  } = await scanForAddressesAndTransactions(
    account,
    nodeClient,
    currentBitcoinNetwork,
    10
  );

  let organizedTransactions: Transaction[];
  let availableUtxos: UTXO[];
  if (nodeClient) {
    console.log(`(${account.id}): Serializing transactions from node...`);
    organizedTransactions = (await serializeTransactionsFromNode(
      nodeClient,
      transactions as BitcoinCoreGetRawTransactionResponse[]
    )) as any;
    console.log(`(${account.id}): Getting UTXO data from node...`);
    availableUtxos = await getUtxosFromNode(
      receiveAddresses,
      changeAddresses,
      nodeClient
    );
  } else {
    console.log(`(${account.id}): Getting UTXO data...`);
    availableUtxos = await getUtxosForAddresses(
      receiveAddresses.concat(changeAddresses),
      currentBitcoinNetwork
    );
    console.log(`(${account.id}): Serializing transactions...`);
    organizedTransactions = serializeTransactions(
      transactions as Transaction[],
      receiveAddresses,
      changeAddresses
    );
  }

  return [
    receiveAddresses,
    changeAddresses,
    organizedTransactions,
    unusedReceiveAddresses,
    unusedChangeAddresses,
    availableUtxos,
  ];
};

export const loadOrCreateWalletViaRPC = async (
  config: AccountConfig,
  nodeClient: any
) => {
  const walletList = await nodeClient.listWallets();
  console.log("walletList: ", walletList);

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
        "", // passphrase
        true // avoid_reuse
      );
      if (config.quorum.totalSigners === 1) {
        if (config.addressType === "p2sh") {
          console.log(`Importing ${config.addressType} addresses...`);
          await nodeClient.importMulti(
            [
              {
                desc: await getWrappedDescriptor(nodeClient, config, false),
                range: [0, 1000],
                timestamp: 1503446400,
                internal: false,
                watchonly: true,
                keypool: true,
              },
              {
                desc: await getWrappedDescriptor(nodeClient, config, true),
                range: [0, 1000],
                timestamp: 1503446400,
                internal: false,
                watchonly: true,
                keypool: true,
              },
            ],
            {
              rescan: true,
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
                keypool: true,
              },
              {
                desc: await getSegwitDescriptor(nodeClient, config, true),
                range: [0, 1000],
                timestamp: 1503446400,
                internal: false,
                watchonly: true,
                keypool: true,
              },
            ],
            {
              rescan: true,
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
              keypool: true,
            },
            {
              desc: await getMultisigDescriptor(nodeClient, config, true),
              range: [0, 1000],
              timestamp: 1503446400,
              internal: false,
              watchonly: true,
              keypool: true,
            },
          ],
          {
            rescan: true,
          }
        );
      }
    }
  }
};
