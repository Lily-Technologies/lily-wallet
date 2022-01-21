import { satoshisToBitcoins, bitcoinsToSatoshis } from 'unchained-bitcoin';
import { Psbt, address, Network } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from '@lily-technologies/ecpair';
import BigNumber from 'bignumber.js';
import coinSelect from 'coinselect';
import { Buffer } from 'buffer';

import { cloneBuffer, bufferToHex } from './other';

import { createMap } from 'src/utils/accountMap';

import {
  UTXO,
  UtxoMap,
  AddressType,
  PsbtInput,
  Transaction,
  FeeRates,
  ExtendedPublicKey,
  LilyOnchainAccount,
  Device
} from '@lily/types';

import { BasePlatform } from 'src/frontend-middleware';

const getBuffer = (item) => {
  if (ArrayBuffer.isView(item)) {
    return Buffer.from(Object.values(item));
  } else if (item && item.data) {
    return Buffer.from(Object.values(item.data));
  }
  throw Error('Invalid item trying to be converted to buffer');
};

const ECPair = ECPairFactory(ecc);

export const combinePsbts = (finalPsbt: Psbt, signedPsbt: Psbt) => {
  const combinedPsbt = finalPsbt.combine(signedPsbt);
  return combinedPsbt;
};

export const validateAddress = (recipientAddress: string, currentBitcoinNetwork: Network) => {
  try {
    address.toOutputScript(recipientAddress, currentBitcoinNetwork);
    return true;
  } catch (e) {
    return false;
  }
};

export const inputValidator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature);

export const truncateAddress = (address: string) => {
  if (address.length < 40) return address;

  return `${address.substring(0, 15)}...${address.substring(address.length - 15, address.length)}`;
};

export const validateSendAmount = (sendAmountInBTC: string, currentBalanceInSatoshi: number) => {
  if (satoshisToBitcoins(currentBalanceInSatoshi).isGreaterThan(sendAmountInBTC)) {
    return true;
  } else {
    return false;
  }
};

export const validateTxForAccount = (psbt: Psbt, currentAccount: LilyOnchainAccount) => {
  const { availableUtxos } = currentAccount;
  const utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
  for (let i = 0; i < psbt.txInputs.length; i++) {
    const currentInput = psbt.txInputs[i];
    const inputBuffer = cloneBuffer(currentInput.hash);
    const currentUtxo =
      utxosMap[`${Buffer.from(inputBuffer.reverse()).toString('hex')}:${currentInput.index}`];
    if (!currentUtxo) {
      throw new Error("This transaction isn't associated with this wallet");
    }
  }
  return true;
};

export const createUtxoMapFromUtxoArray = (utxosArray: UTXO[]) => {
  const utxoMap: UtxoMap = {};
  utxosArray.forEach((utxo) => {
    utxoMap[`${utxo.txid}:${utxo.vout}`] = utxo;
  });
  return utxoMap;
};

export const getFee = (psbt: Psbt, transactions: Transaction[]) => {
  const outputSum = psbt.txOutputs.reduce((acc, cur) => acc + cur.value, 0);
  const txMap = createMap(transactions, 'txid');
  const inputSum = psbt.txInputs.reduce((acc, cur) => {
    const inputBuffer = cloneBuffer(cur.hash);
    const txId = Buffer.from(inputBuffer.reverse()).toString('hex'); // careful, this reverses in place.
    const currentUtxo = txMap[txId];
    return Math.abs(currentUtxo.vout[cur.index].value) + acc;
  }, 0);
  return inputSum - outputSum;
};

export const coinSelection = (amountInSats: number, availableUtxos: UTXO[]) => {
  availableUtxos.sort((a, b) => b.value - a.value); // sort available utxos from largest size to smallest size to minimize inputs
  let currentTotal = new BigNumber(0);
  const spendingUtxos: UTXO[] = [];
  let index = 0;
  while (currentTotal.isLessThan(amountInSats) && index < availableUtxos.length) {
    currentTotal = currentTotal.plus(availableUtxos[index].value);
    spendingUtxos.push(availableUtxos[index]);
    index++;
  }
  if (currentTotal.isLessThan(amountInSats)) {
    throw Error('Not enough funds to complete transaction.');
  }
  return { spendingUtxos, currentTotal };
};

export const broadcastTransaction = async (psbt: Psbt, platform: BasePlatform) => {
  const txHex = psbt.extractTransaction().toHex();
  const data = await platform.broadcastTransaction(txHex);
  return data;
};

export const getPsbtFromText = (file: string) => {
  try {
    return Psbt.fromBase64(file);
  } catch (e) {
    try {
      // try getting hex encoded tx
      return Psbt.fromHex(file);
    } catch (e) {
      throw new Error('Invalid Transaction');
    }
  }
};

export const getSignedFingerprintsFromPsbt = (psbt: Psbt) => {
  let signedFingerprints = [] as string[];
  for (let i = 0; i < psbt.data.inputs.length; i++) {
    const currentInput = psbt.data.inputs[i];
    // if there is, figure out what device it belongs to
    if (currentInput.partialSig) {
      for (let j = 0; j < currentInput.partialSig.length; j++) {
        for (let k = 0; k < currentInput.bip32Derivation!.length; k++) {
          const currentBipItem = currentInput.bip32Derivation![k];
          const currentBipItemFingerprint = bufferToHex(currentBipItem.masterFingerprint);
          if (
            Buffer.compare(currentInput.partialSig![j].pubkey, currentBipItem.pubkey) === 0 &&
            !signedFingerprints.includes(currentBipItemFingerprint)
          ) {
            signedFingerprints.push(currentBipItemFingerprint);
          }
        }
      }
    }
  }
  return signedFingerprints;
};

export const getSignedDevicesFromPsbt = (psbt: Psbt, extendedPublicKeys: ExtendedPublicKey[]) => {
  const signedDevicesObjects: Device[] = [];
  const signedFingerprints = getSignedFingerprintsFromPsbt(psbt);
  for (let i = 0; i < extendedPublicKeys!.length; i++) {
    if (signedFingerprints.includes(extendedPublicKeys[i].device.fingerprint.toLowerCase())) {
      signedDevicesObjects.push(extendedPublicKeys![i].device);
    }
  }
  return signedDevicesObjects;
};

export const createTransaction = async (
  currentAccount: LilyOnchainAccount,
  amountInBitcoins: string,
  recipientAddress: string,
  desiredFee: number,
  estimateFee: () => Promise<FeeRates>,
  currentBitcoinNetwork: Network
) => {
  const { availableUtxos, unusedChangeAddresses, config } = currentAccount;

  const feeRates = await estimateFee();
  let feeRate: number;
  if (desiredFee) {
    feeRate = desiredFee;
  } else {
    // if no specified, use halfHour
    feeRate = feeRates.halfHourFee;
  }

  const { inputs, outputs, fee } = coinSelect(
    availableUtxos,
    [
      {
        address: recipientAddress,
        value: bitcoinsToSatoshis(amountInBitcoins).toNumber()
      }
    ],
    feeRate
  );

  console.log(
    'feeRate, feeRates, fee, inputs, outputs: ',
    feeRate,
    feeRates,
    fee,
    JSON.stringify(inputs),
    JSON.stringify(outputs)
  );

  if (!inputs || !outputs) throw new Error('Unable to construct transaction');
  // TODO: This should be proportional to amount being sent
  if (fee > 50000) throw new Error('Fee too large');

  const psbt = new Psbt({ network: currentBitcoinNetwork });
  psbt.setVersion(2); // These are defaults. This line is not needed.
  psbt.setLocktime(0); // These are defaults. This line is not needed.

  inputs.forEach((input) => {
    const currentInput = {
      hash: input.txid,
      index: input.vout,
      sequence: 0xfffffffd, // always enable RBF
      nonWitnessUtxo: Buffer.from(input.prevTxHex, 'hex'),
      bip32Derivation: input.address.bip32derivation.map((derivation) => ({
        masterFingerprint: Buffer.from(derivation.masterFingerprint, 'hex'),
        pubkey: Buffer.from(derivation.pubkey, 'hex'),
        path: derivation.path
      }))
    };

    // TODO: clean this up
    if (config.addressType === 'P2WSH') {
      // multisig p2wsh requires witnessScript
      // @ts-ignore-line
      currentInput.witnessScript = getBuffer(input.address.redeem.output);
    } else if (config.addressType === 'P2WPKH') {
      // @ts-ignore-line
      currentInput.witnessUtxo = {
        value: input.value,
        // @ts-ignore-line
        script: getBuffer(input.address.output)
      };
    } else if (config.addressType === 'p2sh') {
      // @ts-ignore-line
      currentInput.redeemScript = getBuffer(input.address.redeem.output);
    }

    psbt.addInput(currentInput);
  });

  outputs.forEach((output) => {
    // coinselect doesnt apply address to change output, so add it
    if (!output.address) {
      output.address = unusedChangeAddresses[0].address;
    }

    psbt.addOutput({
      address: output.address,
      value: output.value
    });
  });

  return { psbt, feeRates };
};
