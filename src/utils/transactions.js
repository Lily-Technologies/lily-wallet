import axios from 'axios';
import BigNumber from 'bignumber.js';
import { payments, networks } from 'bitcoinjs-lib';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  generateMultisigFromPublicKeys,
  estimateMultisigTransactionFee,
} from "unchained-bitcoin";

export const getMultisigDeriationPathForNetwork = (network) => {
  if (network === networks.bitcoin) {
    return "m/48'/0'/0'/2'"
  } else if (network === networks.testnet) {
    return "m/48'/1'/0'/2'"
  } else { // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'"
  }
}

export const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork) => {
  if (bitcoinJslibNetwork === networks.bitcoin) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
}

export const createTransactionMapFromTransactionArray = (transactionsArray) => {
  const transactionMap = new Map();
  transactionsArray.forEach((tx) => {
    transactionMap.set(tx.txid, tx)
  });
  return transactionMap
}

export const createAddressMapFromAddressArray = (addressArray) => {
  const addressMap = new Map();
  addressArray.forEach((addr) => {
    addressMap.set(addr.address, addr)
  });
  return addressMap
}

export const coinSelection = (amountInSats, availableUtxos) => {
  availableUtxos.sort((a, b) => b.value - a.value); // sort available utxos from largest size to smallest size to minimize inputs
  let currentTotal = BigNumber(0);
  const spendingUtxos = [];
  let index = 0;
  while (currentTotal.isLessThan(amountInSats) && index < availableUtxos.length) {
    currentTotal = currentTotal.plus(availableUtxos[index].value);
    spendingUtxos.push(availableUtxos[index]);
    index++;
  }
  return [spendingUtxos, currentTotal];
}

export const getFeeForMultisig = async (addressType, numInputs, numOutputs, requiredSigners, totalSigners, currentBitcoinNetwork) => {
  const feeRate = await (await axios.get(blockExplorerAPIURL(`/fee-estimates`, currentBitcoinNetwork))).data;
  return estimateMultisigTransactionFee({
    addressType: addressType,
    numInputs: numInputs,
    numOutputs: numOutputs,
    m: requiredSigners,
    n: totalSigners,
    feesPerByteInSatoshis: feeRate[1].toString()
  })
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
        transactions.set(transactionsFromBlockstream[i].txid, {
          ...transactionsFromBlockstream[i],
          value: transactionsFromBlockstream[i].vout[j].value,
          address: addressesMap.get(transactionsFromBlockstream[i].vout[j].scriptpubkey_address),
          type: 'received',
          totalValue: currentAccountTotal.plus(transactionsFromBlockstream[i].vout[j].value)
        });
        transactionPushed = true;
        currentAccountTotal = currentAccountTotal.plus(transactionsFromBlockstream[i].vout[j].value)
      } else if (changeAddressesMap.get(transactionsFromBlockstream[i].vout[j].scriptpubkey_address)) {



      } else {
        // either outgoing payment or sender change address
        if (!transactions.get(transactionsFromBlockstream[i].txid)) {
          possibleTransactions.set(transactionsFromBlockstream[i].txid, {
            ...transactionsFromBlockstream[i],
            value: transactionsFromBlockstream[i].vout[j].value,
            address: transactionsFromBlockstream[i].vout[j].scriptpubkey_address,
            type: 'sent',
            totalValue: currentAccountTotal.minus(transactionsFromBlockstream[i].vout[j].value + transactionsFromBlockstream[i].fee)
          })
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
        transactions.set(...possibleTx);
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

export const getChildPubKeysFromXpubs = (xpubs, multisig = true, currentBitcoinNetwork) => {
  const childPubKeys = [];
  for (let i = 0; i < 30; i++) {
    xpubs.forEach((xpub) => {
      const childPubKeysBip32Path = `m/0/${i}`;
      const bip32derivationPath = multisig ? `${getMultisigDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}` : `m/84'/0'/0'/${childPubKeysBip32Path.replace('m/', '')}`;
      childPubKeys.push({
        childPubKey: deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)),
        bip32derivation: {
          masterFingerprint: Buffer.from(xpub.parentFingerprint, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)), 'hex'),
          path: bip32derivationPath
        }
      });
    })
  }
  return childPubKeys;
}

export const getChildChangePubKeysFromXpubs = (xpubs, multisig = true, currentBitcoinNetwork) => {
  const childChangePubKeys = [];
  for (let i = 0; i < 30; i++) {
    xpubs.forEach((xpub) => {
      const childChangeAddressPubKeysBip32Path = `m/1/${i}`;
      const bip32derivationPath = multisig ? `${getMultisigDeriationPathForNetwork(currentBitcoinNetwork)}/${childChangeAddressPubKeysBip32Path.replace('m/', '')}` : `m/84'/0'/0'/${childChangeAddressPubKeysBip32Path.replace('m/', '')}`;
      childChangePubKeys.push({
        childPubKey: deriveChildPublicKey(xpub.xpub, childChangeAddressPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)),
        bip32derivation: {
          masterFingerprint: Buffer.from(xpub.parentFingerprint, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(xpub.xpub, childChangeAddressPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)), 'hex'),
          path: bip32derivationPath,
        }
      });
    })
  }
  return childChangePubKeys;
}

const getMultisigAddressesFromPubKeys = (pubkeys, config, currentBitcoinNetwork) => {
  const addresses = [];
  for (let i = 0; i < pubkeys.length; i + 3) {
    const publicKeysForMultisigAddress = pubkeys.splice(i, 3);
    const rawPubkeys = publicKeysForMultisigAddress.map((publicKey) => publicKey.childPubKey);
    rawPubkeys.sort();
    addresses.push({
      ...generateMultisigFromPublicKeys(getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork), config.addressType, config.quorum.requiredSigners, ...rawPubkeys),
      ...{
        bip32derivation: [
          ...publicKeysForMultisigAddress.map((publicKey) => publicKey.bip32derivation)
        ]
      }
    });
  }
  return addresses;
}

const getTransactionsFromAddresses = async (addresses, currentBitcoinNetwork) => {
  const transactions = [];
  for (let i = 0; i < addresses.length; i++) {
    const txsFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/txs`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data;
    transactions.push(...txsFromBlockstream);
  }
  return transactions;
}

const getUnusedAddresses = async (addresses, currentBitcoinNetwork) => {
  const unusedAddresses = [];
  for (let i = 0; i < addresses.length; i++) {
    const txsFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/txs`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data;
    if (!txsFromBlockstream.length > 0) {
      unusedAddresses.push(addresses[i]);
    }
  }
  return unusedAddresses;
}

const getUtxosForAddresses = async (addresses, currentBitcoinNetwork) => {
  const availableUtxos = [];
  for (let i = 0; i < addresses.length; i++) {
    const utxosFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/utxo`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data;
    for (let j = 0; j < utxosFromBlockstream.length; j++) {
      availableUtxos.push({
        ...utxosFromBlockstream[j],
        address: addresses[i]
      })
    }
  }

  return availableUtxos;
}

export const getDataFromMultisig = async (config, currentBitcoinNetwork) => {
  const childPubKeys = getChildPubKeysFromXpubs(config.extendedPublicKeys, true, currentBitcoinNetwork);
  const childChangePubKeys = getChildChangePubKeysFromXpubs(config.extendedPublicKeys, true, currentBitcoinNetwork);

  const addresses = getMultisigAddressesFromPubKeys(childPubKeys, config, currentBitcoinNetwork);
  const changeAddresses = getMultisigAddressesFromPubKeys(childChangePubKeys, config, currentBitcoinNetwork);

  const transactions = await getTransactionsFromAddresses([...addresses, ...changeAddresses], currentBitcoinNetwork);
  const unusedAddresses = await getUnusedAddresses(addresses, currentBitcoinNetwork);
  const unusedChangeAddresses = await getUnusedAddresses(changeAddresses, currentBitcoinNetwork);

  const availableUtxos = await getUtxosForAddresses([...addresses, ...changeAddresses], currentBitcoinNetwork);

  const organizedTransactions = serializeTransactions(transactions, addresses, changeAddresses);

  return [addresses, changeAddresses, organizedTransactions, unusedAddresses, unusedChangeAddresses, availableUtxos];
}

export const getDataFromXPub = async (currentWallet, currentBitcoinNetwork) => {
  const childPubKeys = getChildPubKeysFromXpubs([currentWallet], false, currentBitcoinNetwork);
  const childChangePubKeys = getChildChangePubKeysFromXpubs([currentWallet], false, currentBitcoinNetwork);

  const addresses = childPubKeys.map((childPubKey, i) => {
    return {
      ...payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: currentBitcoinNetwork }),
      bip32derivation: [childPubKey.bip32derivation]
    }
  });

  const changeAddresses = childChangePubKeys.map((childPubKey, i) => {
    return {
      ...payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: currentBitcoinNetwork }),
      bip32derivation: [childPubKey.bip32derivation]
    }
  });

  const transactions = await getTransactionsFromAddresses([...addresses, ...changeAddresses], currentBitcoinNetwork);
  const unusedAddresses = await getUnusedAddresses(addresses, currentBitcoinNetwork);
  const unusedChangeAddresses = await getUnusedAddresses(changeAddresses, currentBitcoinNetwork);

  const availableUtxos = await getUtxosForAddresses([...addresses, ...changeAddresses], currentBitcoinNetwork);

  const organizedTransactions = serializeTransactions(transactions, addresses, changeAddresses);

  return [addresses, changeAddresses, organizedTransactions, unusedAddresses, unusedChangeAddresses, availableUtxos];
}