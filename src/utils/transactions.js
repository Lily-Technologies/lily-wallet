import axios from 'axios';
import BigNumber from 'bignumber.js';
import { payments, ECPair, networks } from 'bitcoinjs-lib';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  generateMultisigFromPublicKeys,
  TESTNET
} from "unchained-bitcoin";

const organizeTransactions = (transactionsFromBlockstream, addresses, changeAddresses) => {
  console.log('transactionsFromBlockstream, addresses, changeAddresses: ', transactionsFromBlockstream, addresses, changeAddresses);
  const changeAddressesArray = changeAddresses.map((changeAddress) => changeAddress.address);
  const addressesArray = addresses.map((address) => address.address);

  transactionsFromBlockstream.sort((a, b) => a.status.block_time - b.status.block_time);

  let currentAccountTotal = BigNumber(0);
  const transactions = [];
  for (let i = 0; i < transactionsFromBlockstream.length; i++) {
    // examine outputs and filter out ouputs that are change addresses back to us
    let transactionPushed = false;
    let possibleTransactions = [];
    for (let j = 0; j < transactionsFromBlockstream[i].vout.length; j++) {
      // console.log('transactionsFromBlockstream[i].vout[j]: ', transactionsFromBlockstream[i].vout[j]);
      if (addressesArray.includes(transactionsFromBlockstream[i].vout[j].scriptpubkey_address)) {
        // received payment
        transactions.push({
          ...transactionsFromBlockstream[i],
          value: transactionsFromBlockstream[i].vout[j].value,
          address: transactionsFromBlockstream[i].vout[j].scriptpubkey_address,
          type: 'received',
          totalValue: currentAccountTotal.plus(transactionsFromBlockstream[i].vout[j].value)
        });
        transactionPushed = true;
        currentAccountTotal = currentAccountTotal.plus(transactionsFromBlockstream[i].vout[j].value)
      } else if (changeAddressesArray.includes(transactionsFromBlockstream[i].vout[j].scriptpubkey_address)) {
        continue;
      } else {
        // either outgoing payment or sender change address
        possibleTransactions.push({
          ...transactionsFromBlockstream[i],
          value: transactionsFromBlockstream[i].vout[j].value,
          address: transactionsFromBlockstream[i].vout[j].scriptpubkey_address,
          type: 'sent',
          totalValue: currentAccountTotal.minus(transactionsFromBlockstream[i].vout[j].value + transactionsFromBlockstream[i].fee)
        })
      }
    }

    if (!transactionPushed) {
      currentAccountTotal = currentAccountTotal.minus(possibleTransactions[0].vout.reduce((accum, vout) => {
        if (!changeAddressesArray.includes(vout.scriptpubkey_address)) {
          return accum.plus(vout.value);
        }
        return accum;
      }, BigNumber(0))).minus(possibleTransactions[0].fee);
      transactions.push(...possibleTransactions);
    }
  }

  transactions.sort((a, b) => b.status.block_time - a.status.block_time);
  return [transactions, currentAccountTotal];
}

export const getTransactionsFromMultisig = async (caravanFile) => {
  const childPublicKeys = [];
  const childChangeAddressPublicKeys = [];
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < caravanFile.extendedPublicKeys.length; j++) {
      childPublicKeys.push(deriveChildPublicKey(caravanFile.extendedPublicKeys[j].xpub, `0/${i}`, TESTNET));
      childChangeAddressPublicKeys.push(deriveChildPublicKey(caravanFile.extendedPublicKeys[j].xpub, `1/${i}`, TESTNET));
    }
  }

  const addresses = [];
  const changeAddresses = [];
  for (let i = 0; i < childPublicKeys.length; i + 3) {
    const publicKeysForMultisigAddress = childPublicKeys.splice(i, 3);
    const changeAddressPublicKeysForMultisigAddress = childChangeAddressPublicKeys.splice(i, 3);
    publicKeysForMultisigAddress.sort();
    changeAddressPublicKeysForMultisigAddress.sort();
    addresses.push(generateMultisigFromPublicKeys(caravanFile.network, caravanFile.addressType, caravanFile.quorum.requiredSigners, ...publicKeysForMultisigAddress));
    changeAddresses.push(generateMultisigFromPublicKeys(caravanFile.network, caravanFile.addressType, caravanFile.quorum.requiredSigners, ...changeAddressPublicKeysForMultisigAddress));
  }

  const transactionsFromBlockstream = [];
  const unusedAddresses = [];
  const availableUtxos = [];
  for (let i = 0; i < addresses.length; i++) {
    const txsFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/txs`, TESTNET))).data;
    if (txsFromBlockstream.length > 0) {
      transactionsFromBlockstream.push(...txsFromBlockstream);
    } else {
      unusedAddresses.push(addresses[i]);
    }

    const utxosFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/utxo`, TESTNET))).data;
    if (utxosFromBlockstream.length > 0) {
      availableUtxos.push(...utxosFromBlockstream);
    }

  }
  return [...organizeTransactions(transactionsFromBlockstream, addresses, changeAddresses), unusedAddresses, availableUtxos];
}

export const getTransactionsAndTotalValueFromXPub = async (currentWallet) => {
  const childPublicKeys = [];
  const childChangePublicKeys = [];
  for (let i = 0; i < 10; i++) {
    childPublicKeys.push(deriveChildPublicKey(currentWallet.xpub, `0/${i}`, TESTNET));
    childChangePublicKeys.push(deriveChildPublicKey(currentWallet.xpub, `1/${i}`, TESTNET));
  }

  const addresses = childPublicKeys.map((childPubKey, i) => {
    return payments.p2wpkh({ pubkey: Buffer.from(childPubKey, 'hex'), network: networks.testnet })
  });

  const changeAddresses = childChangePublicKeys.map((childPubKey, i) => {
    return payments.p2wpkh({ pubkey: Buffer.from(childPubKey, 'hex'), network: networks.testnet })
  });

  const transactionsFromBlockstream = [];
  const unusedAddresses = [];
  const availableUtxos = [];
  for (let i = 0; i < addresses.length; i++) {
    const txsFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/txs`, TESTNET))).data;
    if (txsFromBlockstream.length > 0) {
      transactionsFromBlockstream.push(...txsFromBlockstream);
    } else {
      unusedAddresses.push(addresses[i]);
    }

    const utxosFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/address/${addresses[i].address}/utxo`, TESTNET))).data;
    if (utxosFromBlockstream.length > 0) {
      availableUtxos.push(...utxosFromBlockstream);
    }

  }
  return [...organizeTransactions(transactionsFromBlockstream, addresses, changeAddresses), unusedAddresses, availableUtxos];
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