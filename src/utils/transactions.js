const axios = require('axios');
const BigNumber = require('bignumber.js');
const { payments, networks } = require('bitcoinjs-lib');
const {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  generateMultisigFromPublicKeys,
  bitcoinsToSatoshis
} = require("unchained-bitcoin");

const bitcoinNetworkEqual = (a, b) => {
  return a.bech32 === b.bech32;
}

const getDerivationPath = (addressType, bip32Path, currentBitcoinNetwork) => {
  const childPubKeysBip32Path = bip32Path;
  if (addressType === 'multisig') {
    return `${getMultisigDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}`;
  } else if (addressType === 'p2sh') {
    return `${getP2shDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}`;
  } else { // p2wpkh
    return `${getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}`;
  }
}

const getMultisigDeriationPathForNetwork = (network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/48'/0'/0'/2'"
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/48'/1'/0'/2'"
  } else { // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'"
  }
}

const getP2shDeriationPathForNetwork = (network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/49'/0'/0'"
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/49'/1'/0'"
  } else { // return mainnet by default...this should never run though
    return "m/49'/0'/0'"
  }
}

const getP2wpkhDeriationPathForNetwork = (network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/84'/0'/0'"
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/84'/1'/0'"
  } else { // return mainnet by default...this should never run though
    return "m/84'/0'/0'"
  }
}

const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork) => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
}

const getMultisigDescriptor = async (client, reqSigners, xpubs, isChange) => {
  const descriptor = `wsh(sortedmulti(${reqSigners},${xpubs.map((xpub) => `${xpub.xpub}/${isChange ? '1' : '0'}/*`)}))`;
  const descriptorWithChecksum = await client.getDescriptorInfo(descriptor);
  return descriptorWithChecksum.descriptor;
}

const createAddressMapFromAddressArray = (addressArray, isChange) => {
  const addressMap = new Map();
  addressArray.forEach((addr) => {
    addressMap.set(addr.address, {address: addr, isChange: !!isChange});
  });
  return addressMap
}

/**
 * Function used to aggregate values of inputs/outputs with optional
 * filtering options.
 *
 * @param {Array} items - Array of either inputs or outputs.
 * @param {Boolean} isMine - Whether to restrict sum to our own inputs/outputs.
 * @param {Boolean} isChange - Whether to restrict sum to change inputs/outputs.
 */
const sum = (items, isMine, isChange) => {
  let filtered = items;
  if (typeof isMine === 'boolean')
    filtered = filtered.filter(item => item.isMine === isMine);
  if (typeof isChange === 'boolean')
    filtered = filtered.filter(item => item.isChange === isChange);
  let total = filtered.reduce((accum, item) => {
    const value = item.value !== undefined ? item.value : item.prevout.value;
    return accum + value;
  }, 0);
  return total;
}

/**
 * Function used to add 'isMine' & 'isChange' decoration markers
 * to inputs & outputs.
 *
 * @param {Object} tx - A raw transaction.
 * @param {Map} externalMap - Map of external addresses.
 * @param {Map} changeMap - Map of change addresses.
 */
const decorateTx = (tx, externalMap, changeMap) => {
  tx.vin.forEach((vin, index) => {
    const isChange = !!changeMap.get(vin.prevout.scriptpubkey_address);
    const isMine = isChange || !!externalMap.get(vin.prevout.scriptpubkey_address);
    tx.vin[index] = {...vin, isChange: isChange, isMine: isMine};
  });
  tx.vout.forEach((vout, index) => {
    const isChange = !!changeMap.get(vout.scriptpubkey_address);
    const isMine = isChange || !!externalMap.get(vout.scriptpubkey_address);
    tx.vout[index] = {...vout, isChange: isChange, isMine: isMine};
  });
  return tx;
}

const serializeTransactions = (transactionsFromBlockstream, addresses, changeAddresses) => {
  transactionsFromBlockstream.sort((a, b) => a.status.block_time - b.status.block_time);

  const addressesMap = createAddressMapFromAddressArray(addresses, false);
  const changeAddressesMap = createAddressMapFromAddressArray(changeAddresses);
  const txMap = {};
  const txs = transactionsFromBlockstream
    .map(tx => decorateTx(tx, addressesMap, changeAddressesMap))
    .filter(tx => {
      if (!txMap[tx.txid]) {
        txMap[tx.txid] = tx;
        return true;
      }
      return false;
    });

  let balance = 0;
  txs.forEach(tx => {
    let amountIn, amountOut, amountOutChange;
    amountIn = sum(tx.vin, true);
    amountOut = sum(tx.vout, true);
    amountOutChange = sum(tx.vout, true, true);
    if (amountIn === (amountOut + (amountIn > 0 ? tx.fee : 0))) {
      tx.type = 'moved';
      tx.address = '';
      balance -= tx.fee;
      tx.totalValue = balance;
      tx.address = tx.vout.filter(vout => vout.isChange)[0].scriptpubkey_address;
      tx.value = tx.vout.reduce((accum, item) => accum + item.value, 0);
    } else {
      const feeContribution = amountIn > 0 ? tx.fee : 0
      const netAmount = amountIn - amountOut - feeContribution;
      tx.type = netAmount > 0 ? 'sent' : 'received';
      if (tx.type === 'sent') {
        balance -= ((amountIn - amountOutChange) + feeContribution);
        tx.totalValue = balance;
        tx.address = tx.vout.filter(vout => !vout.isMine)[0].scriptpubkey_address;
        tx.value = tx.vout.filter(vout => !vout.isMine)
          .reduce((accum, item) => accum + item.value, 0);
      } else {
        balance += amountOut;
        tx.totalValue = balance;
        tx.address = tx.vout.filter(vout => vout.isMine)[0].scriptpubkey_address;
        tx.value = tx.vout.filter(vout => vout.isMine)
          .reduce((accum, item) => accum + item.value, 0);
      }
    }
  });
  return txs.sort((a, b) => b.status.block_time - a.status.block_time);
}

const serializeTransactionsFromNode = async (nodeClient, transactions, addresses, changeAddresses) => {
  transactions.sort((a, b) => a.blockheight - b.blockheight);

  let currentAccountTotal = BigNumber(0);
  const transactionsMap = new Map();
  for (let i = 0; i < transactions.length; i++) {
    const currentTransaction = await nodeClient.getTransaction({ txid: transactions[i].txid, verbose: true });
    currentAccountTotal = currentAccountTotal.plus(bitcoinsToSatoshis(currentTransaction.details[0].amount));
    const transactionWithValues = currentTransaction;
    transactionWithValues.value = bitcoinsToSatoshis(currentTransaction.details[0].amount).abs().toNumber();
    transactionWithValues.address = currentTransaction.details[0].address;
    transactionWithValues.type = currentTransaction.details[0].category === 'receive' ? 'received' : 'sent';
    transactionWithValues.totalValue = currentAccountTotal.toNumber();
    transactionWithValues.vout = currentTransaction.decoded.vout.map((vout) => {
      vout.value = bitcoinsToSatoshis(vout.value).abs().toNumber();
      return vout;
    });
    transactionWithValues.vin = currentTransaction.decoded.vin.map((vin) => {
      vin.value = bitcoinsToSatoshis(vin.value).abs().toNumber();
      return vin;
    });
    transactionWithValues.status = {
      block_time: currentTransaction.blocktime,
      block_height: currentTransaction.blockheight,
      confirmed: true // TODO: change later
    }
    transactionsMap.set(currentTransaction.txid, transactionWithValues);
  }

  const transactionsIterator = transactionsMap.values();
  const transactionsArray = [];
  for (let i = 0; i < transactionsMap.size; i++) {
    transactionsArray.push(transactionsIterator.next().value);
  }

  transactionsArray.sort((a, b) => b.status.block_time - a.status.block_time);
  return transactionsArray;
}

const getChildPubKeyFromXpub = (xpub, bip32Path, addressType, currentBitcoinNetwork) => {
  const childPubKeysBip32Path = bip32Path;
  let bip32derivationPath = getDerivationPath(addressType, bip32Path, currentBitcoinNetwork);

  return {
    childPubKey: deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)),
    bip32derivation: {
      masterFingerprint: Buffer.from(xpub.parentFingerprint, 'hex'),
      pubkey: Buffer.from(deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)), 'hex'),
      path: bip32derivationPath
    }
  }
}

const getMultisigAddressFromPubKeys = (pubkeys, config, currentBitcoinNetwork) => {
  const rawPubkeys = pubkeys.map((publicKey) => publicKey.childPubKey);
  rawPubkeys.sort();
  const address = generateMultisigFromPublicKeys(getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork), config.addressType, config.quorum.requiredSigners, ...rawPubkeys);
  address.bip32derivation = pubkeys.map((publicKey) => publicKey.bip32derivation)
  return address;
}

const getUtxosForAddresses = async (addresses, currentBitcoinNetwork) => {
  const availableUtxos = [];
  for (let i = 0; i < addresses.length; i++) {
    const utxosFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/utxo`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data;
    for (let j = 0; j < utxosFromBlockstream.length; j++) {
      const utxo = utxosFromBlockstream[j];
      utxo.address = addresses[i];
      availableUtxos.push(utxo)
    }
  }

  return availableUtxos;
}

const getAddressFromPubKey = (childPubKey, addressType, currentBitcoinNetwork) => {
  let address;
  if (addressType === 'p2sh') {
    address = payments.p2sh({
      redeem: payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: currentBitcoinNetwork }),
      network: currentBitcoinNetwork
    });
  } else { // p2wpkh
    address = payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: currentBitcoinNetwork });
  }

  address.bip32derivation = [childPubKey.bip32derivation];
  return address;
}

const getTransactionsFromAddress = async (address, nodeClient, currentBitcoinNetwork) => {
  if (nodeClient) {
    let addressTxs = [];
    const transactions = await getTransactionsFromNode(nodeClient);
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].address === address) {
        addressTxs.push(transactions[i]);
      }
    }
    return addressTxs;
  } else {
    return await (await axios.get(blockExplorerAPIURL(`/address/${address}/txs`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data
  }
}

const getAddressFromAccount = (account, path, currentBitcoinNetwork) => {
  if (account.quorum.totalSigners > 1) { // multisig
    const childPubKeys = account.extendedPublicKeys.map((extendedPublicKey) => {
      return getChildPubKeyFromXpub(extendedPublicKey, path, 'multisig', currentBitcoinNetwork)
    })
    return getMultisigAddressFromPubKeys(childPubKeys, account, currentBitcoinNetwork)
  } else { // single sig
    if (account.device) {
      const receivePubKey = getChildPubKeyFromXpub(account, path, 'p2sh', currentBitcoinNetwork);
      return getAddressFromPubKey(receivePubKey, 'p2sh', currentBitcoinNetwork);
    } else {
      const receivePubKey = getChildPubKeyFromXpub(account, path, 'p2wpkh', currentBitcoinNetwork);
      return getAddressFromPubKey(receivePubKey, 'p2wpkh', currentBitcoinNetwork);
    }
  }
}



const scanForAddressesAndTransactions = async (account, nodeClient, currentBitcoinNetwork, limitGap) => {
  const receiveAddresses = [];
  const changeAddresses = [];
  let transactions = [];

  const unusedReceiveAddresses = [];
  const unusedChangeAddresses = [];

  let gap = 0;
  let i = 0;

  while (gap < limitGap) {
    const receiveAddress = getAddressFromAccount(account, `m/0/${i}`, currentBitcoinNetwork)

    receiveAddresses.push(receiveAddress);
    const receiveTxs = await getTransactionsFromAddress(receiveAddress.address, nodeClient, currentBitcoinNetwork);
    if (!receiveTxs.length) {
      unusedReceiveAddresses.push(receiveAddress)
    } else {
      transactions = [...transactions, ...receiveTxs]
    }

    const changeAddress = getAddressFromAccount(account, `m/1/${i}`, currentBitcoinNetwork)
    changeAddresses.push(changeAddress);
    const changeTxs = await getTransactionsFromAddress(changeAddress.address, nodeClient, currentBitcoinNetwork)
    if (!changeTxs.length) {
      unusedChangeAddresses.push(changeAddress)
    } else {
      transactions = [...transactions, ...changeTxs]
    }

    if (!!!receiveTxs.length && !!!changeTxs.length) {
      gap = gap + 1;
    } else {
      gap = 0
    }

    i = i + 1;
  }

  if (nodeClient) { // if we are using a node, its better to just get all txs from it.
    transactions = await getTransactionsFromNode(nodeClient);
  }

  return { receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions }
}

const getTransactionsFromNode = async (nodeClient) => {
  return await nodeClient.listTransactions({ count: 100 });
}

const getDataFromMultisig = async (account, nodeClient, currentBitcoinNetwork) => {
  const { receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions } = await scanForAddressesAndTransactions(account, nodeClient, currentBitcoinNetwork, 10)

  let organizedTransactions;
  let availableUtxos;
  if (nodeClient) {
    organizedTransactions = await serializeTransactionsFromNode(nodeClient, transactions, receiveAddresses, changeAddresses);
    availableUtxos = await nodeClient.listUnspent();
    const addressMap = createAddressMapFromAddressArray(receiveAddresses.concat(changeAddresses));
    for (let i = 0; i < availableUtxos.length; i++) {
      availableUtxos[i].value = bitcoinsToSatoshis(availableUtxos[i].amount).toNumber();
      availableUtxos[i].address = addressMap.get(availableUtxos[i].address).address;
    }
  } else {
    organizedTransactions = serializeTransactions(transactions, receiveAddresses, changeAddresses);
    availableUtxos = await getUtxosForAddresses(receiveAddresses.concat(changeAddresses), currentBitcoinNetwork);
  }

  return [receiveAddresses, changeAddresses, organizedTransactions, unusedReceiveAddresses, unusedChangeAddresses, availableUtxos];
}

const getDataFromXPub = async (account, nodeClient, currentBitcoinNetwork) => {
  const { receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions } = await scanForAddressesAndTransactions(account, nodeClient, currentBitcoinNetwork, 10)

  const availableUtxos = await getUtxosForAddresses(receiveAddresses.concat(changeAddresses), currentBitcoinNetwork);
  const organizedTransactions = serializeTransactions(transactions, receiveAddresses, changeAddresses);

  return [receiveAddresses, changeAddresses, organizedTransactions, unusedReceiveAddresses, unusedChangeAddresses, availableUtxos];
}

module.exports = {
  getAddressFromAccount: getAddressFromAccount,
  getMultisigDeriationPathForNetwork: getMultisigDeriationPathForNetwork,
  bitcoinNetworkEqual: bitcoinNetworkEqual,
  getP2shDeriationPathForNetwork: getP2shDeriationPathForNetwork,
  getP2wpkhDeriationPathForNetwork: getP2wpkhDeriationPathForNetwork,
  getDataFromMultisig: getDataFromMultisig,
  getDataFromXPub: getDataFromXPub,
  getUnchainedNetworkFromBjslibNetwork: getUnchainedNetworkFromBjslibNetwork,
  getMultisigDescriptor: getMultisigDescriptor
}