import axios from 'axios';
import BigNumber from 'bignumber.js';
import { payments, ECPair, networks } from 'bitcoinjs-lib';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  bitcoinsToSatoshis,
  generateMultisigFromPublicKeys,
  estimateMultisigTransactionFee,
  TESTNET
} from "unchained-bitcoin";
import { satoshisToBitcoins } from 'unchained-bitcoin/lib/utils';

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

export const getFeeForMultisig = async (addressType, numInputs, numOutputs, requiredSigners, totalSigners) => {
  const feeRate = await (await axios.get(blockExplorerAPIURL(`/fee-estimates`, TESTNET))).data;
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

export const getChildPubKeysFromXpubs = (xpubs, multisig = true) => {
  const childPubKeys = [];
  for (let i = 0; i < 30; i++) {
    xpubs.forEach((xpub) => {
      const childPubKeysBip32Path = `m/0/${i}`;
      const bip32derivationPath = multisig ? `m/48'/1'/0'/2'/${childPubKeysBip32Path.replace('m/', '')}` : childPubKeysBip32Path;
      childPubKeys.push({
        childPubKey: deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, TESTNET),
        bip32derivation: {
          masterFingerprint: Buffer.from(xpub.parentFingerprint, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, TESTNET), 'hex'),
          path: bip32derivationPath
        }
      });
    })
  }
  return childPubKeys;
}

export const getChildChangePubKeysFromXpubs = (xpubs, multisig = true) => {
  const childChangePubKeys = [];
  for (let i = 0; i < 30; i++) {
    xpubs.forEach((xpub) => {
      const childChangeAddressPubKeysBip32Path = `m/1/${i}`;
      const bip32derivationPath = multisig ? `m/48'/1'/0'/2'/${childChangeAddressPubKeysBip32Path.replace('m/', '')}` : childChangeAddressPubKeysBip32Path;
      childChangePubKeys.push({
        childPubKey: deriveChildPublicKey(xpub.xpub, childChangeAddressPubKeysBip32Path, TESTNET),
        bip32derivation: {
          masterFingerprint: Buffer.from(xpub.parentFingerprint, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(xpub.xpub, childChangeAddressPubKeysBip32Path, TESTNET), 'hex'),
          path: bip32derivationPath,
        }
      });
    })
  }
  return childChangePubKeys;
}

const getMultisigAddressesFromPubKeys = (pubkeys, caravanFile) => {
  const addresses = [];
  for (let i = 0; i < pubkeys.length; i + 3) {
    const publicKeysForMultisigAddress = pubkeys.splice(i, 3);
    const rawPubkeys = publicKeysForMultisigAddress.map((publicKey) => publicKey.childPubKey);
    rawPubkeys.sort();
    addresses.push({
      ...generateMultisigFromPublicKeys(caravanFile.network, caravanFile.addressType, caravanFile.quorum.requiredSigners, ...rawPubkeys),
      ...{
        bip32derivation: [
          ...publicKeysForMultisigAddress.map((publicKey) => publicKey.bip32derivation)
        ]
      }
    });
  }
  return addresses;
}

const getTransactionsFromAddresses = async (addresses) => {
  const transactions = [];
  for (let i = 0; i < addresses.length; i++) {
    const txsFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/txs`, TESTNET))).data;
    transactions.push(...txsFromBlockstream);
  }
  return transactions;
}

const getUnusedAddresses = async (addresses) => {
  const unusedAddresses = [];
  for (let i = 0; i < addresses.length; i++) {
    const txsFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/txs`, TESTNET))).data;
    if (!txsFromBlockstream.length > 0) {
      unusedAddresses.push(addresses[i]);
    }
  }
  return unusedAddresses;
}

const getUtxosForAddresses = async (addresses) => {
  console.log('getUtxosForAddresses: ', addresses);
  const availableUtxos = [];
  for (let i = 0; i < addresses.length; i++) {
    const utxosFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/utxo`, TESTNET))).data;
    for (let j = 0; j < utxosFromBlockstream.length; j++) {
      availableUtxos.push({
        ...utxosFromBlockstream[j],
        address: addresses[i]
      })
    }
  }

  return availableUtxos;
}

export const getDataFromMultisig = async (caravanFile) => {
  const childPubKeys = getChildPubKeysFromXpubs(caravanFile.extendedPublicKeys);
  const childChangePubKeys = getChildChangePubKeysFromXpubs(caravanFile.extendedPublicKeys);

  const addresses = getMultisigAddressesFromPubKeys(childPubKeys, caravanFile);
  const changeAddresses = getMultisigAddressesFromPubKeys(childChangePubKeys, caravanFile);

  const transactions = await getTransactionsFromAddresses([...addresses, ...changeAddresses]);
  const unusedAddresses = await getUnusedAddresses(addresses);
  const unusedChangeAddresses = await getUnusedAddresses(changeAddresses);

  const availableUtxos = await getUtxosForAddresses([...addresses, ...changeAddresses]);

  const organizedTransactions = serializeTransactions(transactions, addresses, changeAddresses);

  return [addresses, changeAddresses, organizedTransactions, unusedAddresses, unusedChangeAddresses, availableUtxos];
}

export const getDataFromXPub = async (currentWallet) => {
  console.log('currentWallet: ', currentWallet);
  const childPubKeys = getChildPubKeysFromXpubs([currentWallet], false);
  const childChangePubKeys = getChildChangePubKeysFromXpubs([currentWallet], false);

  const addresses = childPubKeys.map((childPubKey, i) => {
    return {
      ...payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: networks.testnet }),
      bip32derivation: [childPubKey.bip32derivation]
    }
  });

  const changeAddresses = childChangePubKeys.map((childPubKey, i) => {
    return {
      ...payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: networks.testnet }),
      bip32derivation: [childPubKey.bip32derivation]
    }
  });

  const transactions = await getTransactionsFromAddresses([...addresses, ...changeAddresses]);
  const unusedAddresses = await getUnusedAddresses(addresses);
  const unusedChangeAddresses = await getUnusedAddresses(changeAddresses);

  const availableUtxos = await getUtxosForAddresses([...addresses, ...changeAddresses]);

  const organizedTransactions = serializeTransactions(transactions, addresses, changeAddresses);

  return [addresses, changeAddresses, organizedTransactions, unusedAddresses, unusedChangeAddresses, availableUtxos];
}

// export const getInputData = async (amount, payment, isSegwit, redeemType) => {
//   // get all utxos for addresses and change addresses (?)
//   // then figure out what inputs to spend...easiest is just to find an input > output
//   // but if that doesn't exist, then start combining
//   const unspent = await regtestUtils.faucetComplex(payment.output, amount);
//   const utx = await regtestUtils.fetch(unspent.txId);
//   // for non segwit inputs, you must pass the full transaction buffer
//   const nonWitnessUtxo = Buffer.from(utx.txHex, 'hex');
//   // for segwit inputs, you only need the output script and value as an object.
//   const witnessUtxo = getWitnessUtxo(utx.outs[unspent.vout]);
//   const mixin = isSegwit ? { witnessUtxo } : { nonWitnessUtxo };
//   const mixin2: any = {};
//   switch (redeemType) {
//     case 'p2sh':
//       mixin2.redeemScript = payment.redeem.output;
//       break;
//     case 'p2wsh':
//       mixin2.witnessScript = payment.redeem.output;
//       break;
//     case 'p2sh-p2wsh':
//       mixin2.witnessScript = payment.redeem.redeem.output;
//       mixin2.redeemScript = payment.redeem.output;
//       break;
//   }
//   return {
//     hash: unspent.txId,
//     index: unspent.vout,
//     ...mixin,
//     ...mixin2,
//   };
// }