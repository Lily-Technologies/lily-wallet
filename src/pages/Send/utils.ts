import axios from 'axios';

import {
  bitcoinsToSatoshis,
  multisigWitnessScript,
  blockExplorerAPIURL,
  estimateMultisigTransactionFee
} from "unchained-bitcoin";
import { Psbt, address, Network } from 'bitcoinjs-lib';

import BigNumber from 'bignumber.js';
import { coinSelect } from 'coinselect';

import { cloneBuffer } from '../../utils/other';
import { getUnchainedNetworkFromBjslibNetwork } from '../../utils/files';

import { LilyAccount, UTXO, UtxoMap, AddressType, Transaction, Address } from '../../types'

const getTxHex = async (txid: string, currentBitcoinNetwork: Network) => {
  const txHex = await (await axios.get(blockExplorerAPIURL(`/tx/${txid}/hex`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data;
  return txHex;
}

export const combinePsbts = (finalPsbt: Psbt, signedPsbts: string[]) => {
  const psbt = finalPsbt;
  const base64SignedPsbts = signedPsbts.map((psbt) => {
    return Psbt.fromBase64(psbt);
  })
  if (base64SignedPsbts.length) { // if there are signed psbts, combine them
    psbt.combine(...base64SignedPsbts);
  }
  return psbt;
}

export const validateAddress = (recipientAddress: string, currentBitcoinNetwork: Network) => {
  try {
    address.toOutputScript(recipientAddress, currentBitcoinNetwork)
    return true
  } catch (e) {
    return false
  }
}

export const createUtxoMapFromUtxoArray = (utxosArray: UTXO[]) => {
  const utxoMap: UtxoMap = {};
  utxosArray.forEach((utxo) => {
    utxoMap[`${utxo.txid}:${utxo.vout}`] = utxo
  });
  return utxoMap
}

export const getFeeForMultisig = (feeRate: number, addressType: AddressType, numInputs: number, numOutputs: number, requiredSigners: number, totalSigners: number) => {
  const feeRateString = feeRate.toString();
  return estimateMultisigTransactionFee({
    addressType: addressType,
    numInputs: numInputs,
    numOutputs: numOutputs,
    m: requiredSigners,
    n: totalSigners,
    feesPerByteInSatoshis: feeRateString
  })
}

export const getFee = (psbt: Psbt, transactions: Transaction[]) => {
  const outputSum = psbt.txOutputs.reduce((acc, cur) => acc + cur.value, 0);
  const txMap = createTransactionMapFromTransactionArray(transactions);
  const inputSum = psbt.txInputs.reduce((acc, cur) => {
    const inputBuffer = cloneBuffer(cur.hash);
    const currentUtxo = txMap.get(inputBuffer.reverse().toString('hex'));
    return Math.abs(currentUtxo.vout[cur.index].value) + acc
  }, 0);
  return inputSum - outputSum;
}

const createTransactionMapFromTransactionArray = (transactionsArray: Transaction[]) => {
  const transactionMap = new Map();
  transactionsArray.forEach((tx) => {
    transactionMap.set(tx.txid, tx)
  });
  return transactionMap
}

const coinSelection = (amountInSats: number, availableUtxos: UTXO[]) => {
  availableUtxos.sort((a, b) => b.value - a.value); // sort available utxos from largest size to smallest size to minimize inputs
  let currentTotal = new BigNumber(0);
  const spendingUtxos = [];
  let index = 0;
  while (currentTotal.isLessThan(amountInSats) && index < availableUtxos.length) {
    currentTotal = currentTotal.plus(availableUtxos[index].value);
    spendingUtxos.push(availableUtxos[index]);
    index++;
  }
  return { spendingUtxos, currentTotal };
}

export const createTransaction = async (currentAccount: LilyAccount, amountInBitcoins: string, recipientAddress: string, desiredFee: string | undefined, availableUtxos: UTXO[], unusedChangeAddresses: Address[], currentBitcoinNetwork: Network) => {
  let fee;
  const feeRates = await window.ipcRenderer.invoke('/estimateFee');
  if (desiredFee !== undefined) { // if no fee specified, pick halfhour
    fee = desiredFee;
  } else if (currentAccount.config.quorum.totalSigners > 1) {
    fee = await getFeeForMultisig(feeRates.halfHourFee, currentAccount.config.addressType, 1, 2, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
  } else {
    const coinSelectResult = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(amountInBitcoins).toNumber() }], feeRates.halfHourFee);
    fee = coinSelectResult.fee;
  }

  let outputTotal = new BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(fee).toNumber();
  let { spendingUtxos, currentTotal: spendingUtxosTotal } = coinSelection(outputTotal, availableUtxos);

  if (spendingUtxos.length > 1 && !desiredFee && currentAccount.config.quorum.totalSigners > 1) { // we assumed 1 input utxo when first calculating fee, if more inputs then readjust fee
    fee = await getFeeForMultisig(feeRates.halfHourFee, currentAccount.config.addressType, spendingUtxos.length, 2, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    outputTotal = new BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(fee).toNumber();
    ({ spendingUtxos, currentTotal: spendingUtxosTotal } = coinSelection(outputTotal, availableUtxos));
  }

  const psbt = new Psbt({ network: currentBitcoinNetwork });
  psbt.setVersion(2); // These are defaults. This line is not needed.
  psbt.setLocktime(0); // These are defaults. This line is not needed.

  for (let i = 0; i < spendingUtxos.length; i++) {
    const utxo = spendingUtxos[i];
    if (currentAccount.config.quorum.totalSigners > 1) {

      // need to construct prevTx b/c of segwit fee vulnerability requires on trezor
      const prevTxHex = await getTxHex(utxo.txid, currentBitcoinNetwork);

      // KBC-TODO: eventually break this up into different functions depending on if Trezor or not, leave for now...I guess
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        sequence: 0xffffffff,
        nonWitnessUtxo: Buffer.from(prevTxHex, 'hex'),
        witnessScript: Buffer.from(multisigWitnessScript(utxo.address).output),
        bip32Derivation: utxo.address.bip32derivation.map((derivation) => ({
          masterFingerprint: Buffer.from(derivation.masterFingerprint.buffer, derivation.masterFingerprint.byteOffset, derivation.masterFingerprint.byteLength),
          pubkey: Buffer.from(derivation.pubkey.buffer, derivation.pubkey.byteOffset, derivation.pubkey.byteLength),
          path: derivation.path
        }))
      })
    } else if (currentAccount.config.mnemonic) {
      const prevTxHex = await getTxHex(utxo.txid, currentBitcoinNetwork);
      // KBC-TODO: eventually break this up into different functions depending on if Trezor or not, leave for now...I guess
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        sequence: 0xffffffff,
        nonWitnessUtxo: Buffer.from(prevTxHex, 'hex'),
        bip32Derivation: [{
          masterFingerprint: Buffer.from(utxo.address.bip32derivation[0].masterFingerprint.buffer, utxo.address.bip32derivation[0].masterFingerprint.byteOffset, utxo.address.bip32derivation[0].masterFingerprint.byteLength),
          pubkey: Buffer.from(utxo.address.bip32derivation[0].pubkey.buffer, utxo.address.bip32derivation[0].pubkey.byteOffset, utxo.address.bip32derivation[0].pubkey.byteLength),
          path: utxo.address.bip32derivation[0].path
        }]
      })
    } else {
      const prevTxHex = await getTxHex(utxo.txid, currentBitcoinNetwork);
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        sequence: 0xffffffff,
        redeemScript: Buffer.from(utxo.address.redeem.output.buffer, utxo.address.redeem.output.byteOffset, utxo.address.redeem.output.byteLength),
        nonWitnessUtxo: Buffer.from(prevTxHex, 'hex'),
        bip32Derivation: [{
          masterFingerprint: Buffer.from(utxo.address.bip32derivation[0].masterFingerprint.buffer, utxo.address.bip32derivation[0].masterFingerprint.byteOffset, utxo.address.bip32derivation[0].masterFingerprint.byteLength),
          pubkey: Buffer.from(utxo.address.bip32derivation[0].pubkey.buffer, utxo.address.bip32derivation[0].pubkey.byteOffset, utxo.address.bip32derivation[0].pubkey.byteLength),
          path: utxo.address.bip32derivation[0].path
        }]
      })
    }
  }

  psbt.addOutput({
    script: address.toOutputScript(recipientAddress, currentBitcoinNetwork),
    value: bitcoinsToSatoshis(amountInBitcoins).toNumber(),
  });

  if (spendingUtxosTotal.isGreaterThan(outputTotal)) {
    psbt.addOutput({
      script: address.toOutputScript(unusedChangeAddresses[0].address, currentBitcoinNetwork),
      value: spendingUtxosTotal.minus(outputTotal).toNumber()
    })
  }

  return { psbt, fee, feeRates }
}