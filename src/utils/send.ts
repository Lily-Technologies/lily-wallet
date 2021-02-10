import axios from "axios";

import {
  satoshisToBitcoins,
  bitcoinsToSatoshis,
  multisigWitnessScript,
  blockExplorerAPIURL,
  estimateMultisigTransactionFee,
  MAINNET,
  TESTNET,
} from "unchained-bitcoin";
import { Psbt, address, Network } from "bitcoinjs-lib";

import BigNumber from "bignumber.js";
import coinSelect from "coinselect";

import { cloneBuffer, bufferToHex } from "./other";

import {
  LilyAccount,
  UTXO,
  UtxoMap,
  AddressType,
  PsbtInput,
  Transaction,
  TransactionMap,
  FeeRates,
  NodeConfig,
  ExtendedPublicKey,
} from "../types";

export const combinePsbts = (finalPsbt: Psbt, signedPsbt: Psbt) => {
  const combinedPsbt = finalPsbt.combine(signedPsbt);
  return combinedPsbt;
};

export const validateAddress = (
  recipientAddress: string,
  currentBitcoinNetwork: Network
) => {
  try {
    address.toOutputScript(recipientAddress, currentBitcoinNetwork);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateSendAmount = (
  sendAmountInBTC: string,
  currentBalanceInSatoshi: number
) => {
  if (
    satoshisToBitcoins(new BigNumber(currentBalanceInSatoshi)).isGreaterThan(
      sendAmountInBTC
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export const validateTxForAccount = (
  psbt: Psbt,
  currentAccount: LilyAccount
) => {
  const { availableUtxos } = currentAccount;
  const utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
  for (let i = 0; i < psbt.txInputs.length; i++) {
    const currentInput = psbt.txInputs[i];
    const inputBuffer = cloneBuffer(currentInput.hash);
    const currentUtxo =
      utxosMap[
        `${inputBuffer.reverse().toString("hex")}:${currentInput.index}`
      ];
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

export const createTransactionMapFromTransactionArray = (
  transactionsArray: Transaction[]
) => {
  const transactionMap: TransactionMap = {};
  transactionsArray.forEach((tx) => {
    transactionMap[tx.txid] = tx;
  });
  return transactionMap;
};

// freeRate is in sats/byte
export const getFeeForMultisig = (
  feesPerByteInSatoshis: number,
  addressType: AddressType,
  numInputs: number,
  numOutputs: number,
  requiredSigners: number,
  totalSigners: number
) => {
  const feeRateString = feesPerByteInSatoshis.toString();
  return estimateMultisigTransactionFee({
    addressType: addressType,
    numInputs: numInputs,
    numOutputs: numOutputs,
    m: requiredSigners,
    n: totalSigners,
    feesPerByteInSatoshis: feeRateString,
  });
};

export const getFee = (psbt: Psbt, transactions: Transaction[]) => {
  const outputSum = psbt.txOutputs.reduce((acc, cur) => acc + cur.value, 0);
  const txMap = createTransactionMapFromTransactionArray(transactions);
  const inputSum = psbt.txInputs.reduce((acc, cur) => {
    const inputBuffer = cloneBuffer(cur.hash);
    const txId = inputBuffer.reverse().toString("hex"); // careful, this reverses in place.
    const currentUtxo = txMap[txId];
    return Math.abs(currentUtxo.vout[cur.index].value) + acc;
  }, 0);
  return inputSum - outputSum;
};

export const coinSelection = (amountInSats: number, availableUtxos: UTXO[]) => {
  availableUtxos.sort((a, b) => b.value - a.value); // sort available utxos from largest size to smallest size to minimize inputs
  let currentTotal = new BigNumber(0);
  const spendingUtxos = [];
  let index = 0;
  while (
    currentTotal.isLessThan(amountInSats) &&
    index < availableUtxos.length
  ) {
    currentTotal = currentTotal.plus(availableUtxos[index].value);
    spendingUtxos.push(availableUtxos[index]);
    index++;
  }
  return { spendingUtxos, currentTotal };
};

export const broadcastTransaction = async (
  currentAccount: LilyAccount,
  psbt: Psbt,
  nodeConfig: NodeConfig,
  currentBitcoinNetwork: Network
) => {
  if (nodeConfig.provider !== "Blockstream") {
    const data = await window.ipcRenderer.invoke("/broadcastTx", {
      walletName: currentAccount.name,
      txHex: psbt.extractTransaction().toHex(),
    });
    return data;
  } else {
    const txBody = psbt.extractTransaction().toHex();
    const network = currentBitcoinNetwork.bech32 === "bc" ? MAINNET : TESTNET;
    const { data } = await axios.post(
      blockExplorerAPIURL("/tx", network),
      txBody
    );
    return data;
  }
};

export const getPsbtFromText = (file: string) => {
  try {
    return Psbt.fromBase64(file);
  } catch (e) {
    try {
      // try getting hex encoded tx
      return Psbt.fromHex(file);
    } catch (e) {
      throw new Error("Invalid Transaction");
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
          const currentBipItemFingerprint = bufferToHex(
            currentBipItem.masterFingerprint
          );
          if (
            Buffer.compare(
              currentInput.partialSig![j].pubkey,
              currentBipItem.pubkey
            ) === 0 &&
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

export const getSignedDevicesFromPsbt = (
  psbt: Psbt,
  extendedPublicKeys: ExtendedPublicKey[]
) => {
  const signedDevicesObjects = [];
  const signedFingerprints = getSignedFingerprintsFromPsbt(psbt);
  for (let i = 0; i < extendedPublicKeys!.length; i++) {
    if (
      signedFingerprints.includes(
        extendedPublicKeys[i].device.fingerprint.toLowerCase()
      )
    ) {
      signedDevicesObjects.push(extendedPublicKeys![i].device);
    }
  }
  return signedDevicesObjects;
};

export const createTransaction = async (
  currentAccount: LilyAccount,
  amountInBitcoins: string,
  recipientAddress: string,
  desiredFee: BigNumber,
  currentBitcoinNetwork: Network
) => {
  const { availableUtxos, unusedChangeAddresses, config } = currentAccount;
  let fee: BigNumber;
  const feeRates: FeeRates = await window.ipcRenderer.invoke("/estimateFee");
  if (desiredFee.toNumber() !== 0) {
    // if no fee specified, pick halfhour
    fee = new BigNumber(desiredFee);
  } else if (config.quorum.totalSigners > 1) {
    fee = await getFeeForMultisig(
      feeRates.halfHourFee,
      config.addressType,
      1,
      2,
      config.quorum.requiredSigners,
      config.quorum.totalSigners
    ).integerValue(BigNumber.ROUND_CEIL);
  } else {
    const coinSelectResult = coinSelect(
      availableUtxos,
      [
        {
          address: recipientAddress,
          value: bitcoinsToSatoshis(amountInBitcoins).toNumber(),
        },
      ],
      feeRates.halfHourFee
    );
    fee = new BigNumber(coinSelectResult.fee);
  }

  let outputTotal = new BigNumber(bitcoinsToSatoshis(amountInBitcoins))
    .plus(fee)
    .toNumber();
  let { spendingUtxos, currentTotal: spendingUtxosTotal } = coinSelection(
    outputTotal,
    availableUtxos
  );

  if (
    spendingUtxos.length > 1 &&
    !desiredFee &&
    config.quorum.totalSigners > 1
  ) {
    // we assumed 1 input utxo when first calculating fee, if more inputs then readjust fee
    fee = await getFeeForMultisig(
      feeRates.halfHourFee,
      config.addressType,
      spendingUtxos.length,
      2,
      config.quorum.requiredSigners,
      config.quorum.totalSigners
    ).integerValue(BigNumber.ROUND_CEIL);
    outputTotal = new BigNumber(bitcoinsToSatoshis(amountInBitcoins))
      .plus(fee)
      .toNumber();
    ({ spendingUtxos, currentTotal: spendingUtxosTotal } = coinSelection(
      outputTotal,
      availableUtxos
    ));
  }

  const psbt = new Psbt({ network: currentBitcoinNetwork });
  psbt.setVersion(2); // These are defaults. This line is not needed.
  psbt.setLocktime(0); // These are defaults. This line is not needed.

  for (let i = 0; i < spendingUtxos.length; i++) {
    const utxo = spendingUtxos[i];

    const currentInput = {
      hash: utxo.txid,
      index: utxo.vout,
      sequence: 0xffffffff,
      nonWitnessUtxo: Buffer.from(utxo.prevTxHex, "hex"),
      bip32Derivation: utxo.address.bip32derivation.map((derivation) => ({
        masterFingerprint: Buffer.from(
          Object.values(derivation.masterFingerprint)
        ),
        pubkey: Buffer.from(Object.values(derivation.pubkey)),
        path: derivation.path,
      })),
    } as PsbtInput;

    if (config.quorum.totalSigners > 1) {
      // multisig p2wsh requires witnessScript
      currentInput.witnessScript = Buffer.from(
        Object.values(multisigWitnessScript(utxo.address).output)
      );
    } else if (config.mnemonic === undefined) {
      // hardware wallet, add redeemScript
      // KBC-TODO: clean this up
      currentInput.redeemScript = Buffer.from(
        (Object.values(utxo.address.redeem.output) as unknown) as Buffer
      );
    }

    psbt.addInput(currentInput);
  }

  psbt.addOutput({
    script: address.toOutputScript(recipientAddress, currentBitcoinNetwork),
    value: bitcoinsToSatoshis(amountInBitcoins).toNumber(),
  });

  if (spendingUtxosTotal.isGreaterThan(outputTotal)) {
    psbt.addOutput({
      ...unusedChangeAddresses[0],
      value: spendingUtxosTotal.minus(outputTotal).toNumber(),
    });
  }

  return { psbt, feeRates };
};
