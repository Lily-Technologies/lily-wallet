const axios = require('axios');
const BigNumber = require('bignumber.js');
const { payments, networks } = require('bitcoinjs-lib');
const {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  generateMultisigFromPublicKeys,
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

const createAddressMapFromAddressArray = (addressArray) => {
  const addressMap = new Map();
  addressArray.forEach((addr) => {
    addressMap.set(addr.address, addr)
  });
  return addressMap
}

const serializeTransactions = (transactionsFromBlockstream, addresses, changeAddresses) => {
  const changeAddressesMap = createAddressMapFromAddressArray(changeAddresses);
  const addressesMap = createAddressMapFromAddressArray(addresses);

  transactionsFromBlockstream.sort((a, b) => a.status.block_time - b.status.block_time);

  let currentAccountTotal = BigNumber(0);
  const transactions = new Map();
  for (let i = 0; i < transactionsFromBlockstream.length; i++) {
    // examine outputs and filter out ouputs that are change addresses back to us
    let transactionPushed = false;
    let possibleTransactions = new Map();
    for (let j = 0; j < transactionsFromBlockstream[i].vout.length; j++) {
      if (addressesMap.get(transactionsFromBlockstream[i].vout[j].scriptpubkey_address)) {
        // received payment
        const transactionWithValues = transactionsFromBlockstream[i];
        transactionWithValues.value = transactionsFromBlockstream[i].vout[j].value;
        transactionWithValues.address = addressesMap.get(transactionsFromBlockstream[i].vout[j].scriptpubkey_address);
        transactionWithValues.type = 'received';
        transactionWithValues.totalValue = currentAccountTotal.plus(transactionsFromBlockstream[i].vout[j].value).toNumber();
        transactions.set(transactionsFromBlockstream[i].txid, transactionWithValues);
        transactionPushed = true;
        currentAccountTotal = currentAccountTotal.plus(transactionsFromBlockstream[i].vout[j].value)
      } else if (changeAddressesMap.get(transactionsFromBlockstream[i].vout[j].scriptpubkey_address)) {



      } else {
        // either outgoing payment or sender change address
        if (!transactions.get(transactionsFromBlockstream[i].txid)) {
          const transactionWithValues = transactionsFromBlockstream[i];
          transactionWithValues.value = transactionsFromBlockstream[i].vout[j].value;
          transactionWithValues.address = transactionsFromBlockstream[i].vout[j].scriptpubkey_address;
          transactionWithValues.type = 'sent';
          transactionWithValues.totalValue = currentAccountTotal.minus(transactionsFromBlockstream[i].vout[j].value + transactionsFromBlockstream[i].fee).toNumber();
          possibleTransactions.set(transactionsFromBlockstream[i].txid, transactionWithValues)
        }
      }
    }

    if (!transactionPushed) {
      const possibleTransactionsIterator = possibleTransactions.entries();
      for (let i = 0; i < possibleTransactions.size; i++) {
        const possibleTx = possibleTransactionsIterator.next().value;
        currentAccountTotal = currentAccountTotal.minus(possibleTx[1].vout.reduce((accum, vout) => {
          if (!changeAddressesMap.get(vout.scriptpubkey_address)) {
            return accum.plus(vout.value);
          }
          return accum;
        }, BigNumber(0))).minus(possibleTx[1].fee);
        transactions.set(possibleTx[0], possibleTx[1]);
      }
    }
  }

  const transactionsIterator = transactions.values();
  const transactionsArray = [];
  for (let i = 0; i < transactions.size; i++) {
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

const getTransactionsFromAddress = async (address, currentBitcoinNetwork) => {
  return await (await axios.get(blockExplorerAPIURL(`/address/${address}/txs`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data
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



const scanForAddressesAndTransactions = async (account, currentBitcoinNetwork, limitGap) => {
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
    const receiveTxs = await getTransactionsFromAddress(receiveAddress.address, currentBitcoinNetwork);
    if (!receiveTxs.length) {
      unusedReceiveAddresses.push(receiveAddress)
    } else {
      transactions = [...transactions, ...receiveTxs]
    }

    const changeAddress = getAddressFromAccount(account, `m/1/${i}`, currentBitcoinNetwork)
    changeAddresses.push(changeAddress);
    const changeTxs = await getTransactionsFromAddress(changeAddress.address, currentBitcoinNetwork)
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
  return { receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions }
}

const getDataFromMultisig = async (account, currentBitcoinNetwork) => {
  const { receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions } = await scanForAddressesAndTransactions(account, currentBitcoinNetwork, 10)
  const availableUtxos = await getUtxosForAddresses(receiveAddresses.concat(changeAddresses), currentBitcoinNetwork);
  const organizedTransactions = serializeTransactions(transactions, receiveAddresses, changeAddresses);

  return [receiveAddresses, changeAddresses, organizedTransactions, unusedReceiveAddresses, unusedChangeAddresses, availableUtxos];
}

const getDataFromXPub = async (account, currentBitcoinNetwork) => {
  const { receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions } = await scanForAddressesAndTransactions(account, currentBitcoinNetwork, 10)

  const availableUtxos = await getUtxosForAddresses(receiveAddresses.concat(changeAddresses), currentBitcoinNetwork);
  const organizedTransactions = serializeTransactions(transactions, receiveAddresses, changeAddresses);

  return [receiveAddresses, changeAddresses, organizedTransactions, unusedReceiveAddresses, unusedChangeAddresses, availableUtxos];
}

module.exports = {
  bitcoinNetworkEqual: bitcoinNetworkEqual,
  getMultisigDeriationPathForNetwork: getMultisigDeriationPathForNetwork,
  getP2shDeriationPathForNetwork: getP2shDeriationPathForNetwork,
  getP2wpkhDeriationPathForNetwork: getP2wpkhDeriationPathForNetwork,
  createAddressMapFromAddressArray: createAddressMapFromAddressArray,
  getDataFromMultisig: getDataFromMultisig,
  getDataFromXPub: getDataFromXPub,
  getUnchainedNetworkFromBjslibNetwork: getUnchainedNetworkFromBjslibNetwork
}