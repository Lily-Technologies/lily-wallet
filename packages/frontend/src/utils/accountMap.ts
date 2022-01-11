import { payments, networks, Network } from 'bitcoinjs-lib';
import { deriveChildPublicKey, generateMultisigFromPublicKeys } from 'unchained-bitcoin';
import { Buffer } from 'buffer';

import {
  OnChainConfig,
  Address,
  AddressType,
  AddressMap,
  Vin,
  Vout,
  Transaction,
  PubKey,
  ExtendedPublicKey,
  EsploraTransactionResponse,
  TransactionType
} from '@lily/types';

import { bitcoinNetworkEqual } from 'src/utils/files';

function isVout(item: Vin | Vout): item is Vout {
  return (item as Vout).value !== undefined;
}

export const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork: Network) => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
};

export const createMap = <T extends { [key: string]: any }>(items: T[], key: string) => {
  return items.reduce((map: { [key: string]: T }, object: T) => {
    map[object[key]] = object;
    return map;
  }, {});
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
  if (isMine) filtered = filtered.filter((item) => item.isMine === isMine);
  if (isChange) filtered = filtered.filter((item) => item.isChange === isChange);
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
  tx: EsploraTransactionResponse,
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
  transactionsFromBlockstream: EsploraTransactionResponse[],
  addresses: Address[],
  changeAddresses: Address[]
): Transaction[] => {
  transactionsFromBlockstream.sort((a, b) => a.status.block_time - b.status.block_time);

  const addressesMap = createMap(addresses, 'address');
  const changeAddressesMap = createMap(changeAddresses, 'address');

  const txMap = createMap(transactionsFromBlockstream, 'txid');
  const decoratedTxs = Object.values(txMap).map((tx) =>
    decorateTx(tx, addressesMap, changeAddressesMap)
  );

  let balance = 0;
  const serializedTxs = decoratedTxs.map((tx) => {
    let amountIn: number, amountOut: number, amountOutChange: number;
    amountIn = sum(tx.vin, true);
    amountOut = sum(tx.vout, true);
    amountOutChange = sum(tx.vout, true, true);

    let type: TransactionType;
    let address: string;
    let totalValue: number;
    let value: number;
    // TODO: this is broken when Electrum is Provider
    if (amountIn === amountOut + (amountIn > 0 ? tx.fee : 0)) {
      type = 'moved';
      address = '';
      balance -= tx.fee;
      totalValue = balance;
      address = tx.vout.filter((vout) => vout.isChange)[0].scriptpubkey_address;
      value = tx.vout.reduce((accum, item) => accum + item.value, 0);
    } else {
      const feeContribution = amountIn > 0 ? tx.fee : 0;
      const netAmount = amountIn - amountOut - feeContribution;
      type = netAmount > 0 ? 'sent' : 'received';
      if (type === 'sent') {
        balance -= amountIn - amountOutChange + feeContribution;
        totalValue = balance;
        address = tx.vout.filter((vout) => !vout.isMine)[0].scriptpubkey_address;
        value = tx.vout
          .filter((vout) => !vout.isMine)
          .reduce((accum, item) => accum + item.value, 0);
      } else {
        balance += amountOut;
        totalValue = balance;
        address = tx.vout.filter((vout) => vout.isMine)[0].scriptpubkey_address;
        value = tx.vout
          .filter((vout) => vout.isMine)
          .reduce((accum, item) => accum + item.value, 0);
      }
    }
    return {
      ...tx,
      type,
      address,
      totalValue,
      value
    } as Transaction;
  });

  return serializedTxs.sort((a, b) => b.status.block_time - a.status.block_time);
};

const getChildPubKeyFromXpub = (
  xpub: ExtendedPublicKey,
  bip32Path: string,
  currentBitcoinNetwork: Network
) => {
  const childPubKeysBip32Path = bip32Path;
  let bip32derivationPath = `${xpub.bip32Path}/${bip32Path.replace('m/', '')}`;

  return {
    childPubKey: deriveChildPublicKey(
      xpub.xpub!,
      childPubKeysBip32Path,
      getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
    ),
    bip32derivation: {
      masterFingerprint: Buffer.from(xpub.parentFingerprint as string, 'hex'),
      pubkey: Buffer.from(
        deriveChildPublicKey(
          xpub.xpub!,
          childPubKeysBip32Path,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        ),
        'hex'
      ),
      path: bip32derivationPath
    }
  };
};

const getMultisigAddressFromPubKeys = (
  pubkeys: PubKey[],
  config: OnChainConfig,
  currentBitcoinNetwork: Network
): Address => {
  const rawPubkeys = pubkeys.map((publicKey) => publicKey.childPubKey);
  rawPubkeys.sort();

  const address = generateMultisigFromPublicKeys(
    getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    config.addressType,
    config.quorum.requiredSigners,
    ...rawPubkeys
  );
  const decoratedAddress = {
    ...address,
    bip32derivation: pubkeys.map((publicKey) => publicKey.bip32derivation)
  } as Address;

  return decoratedAddress;
};

const getAddressFromPubKey = (
  childPubKey: PubKey,
  addressType: AddressType,
  currentBitcoinNetwork: Network
): Address => {
  if (addressType === 'p2sh') {
    const {
      // network,
      address: _address,
      hash,
      output,
      redeem,
      input,
      witness
    } = payments.p2sh({
      redeem: payments.p2wpkh({
        pubkey: Buffer.from(childPubKey.childPubKey, 'hex'),
        network: currentBitcoinNetwork
      }),
      network: currentBitcoinNetwork
    });
    return {
      network: currentBitcoinNetwork,
      address: _address as string,
      hash,
      output,
      redeem,
      input,
      witness,
      bip32derivation: [childPubKey.bip32derivation]
    };
  } else {
    // p2wpkh
    const {
      // network,
      address: _address,
      hash,
      output,
      redeem,
      input,
      witness
    } = payments.p2wpkh({
      pubkey: Buffer.from(childPubKey.childPubKey, 'hex'),
      network: currentBitcoinNetwork
    });
    return {
      network: currentBitcoinNetwork,
      address: _address as string,
      hash,
      output,
      redeem,
      input,
      witness,
      bip32derivation: [childPubKey.bip32derivation]
    };
  }
};

export const getAddressFromAccount = (
  account: OnChainConfig,
  path: string,
  currentBitcoinNetwork: Network
) => {
  if (account.quorum.totalSigners > 1) {
    // multisig
    const childPubKeys = account.extendedPublicKeys.map((extendedPublicKey) => {
      return getChildPubKeyFromXpub(extendedPublicKey, path, currentBitcoinNetwork);
    });
    return getMultisigAddressFromPubKeys(childPubKeys, account, currentBitcoinNetwork);
  } else {
    // single sig
    const receivePubKey = getChildPubKeyFromXpub(
      account.extendedPublicKeys[0],
      path,
      currentBitcoinNetwork
    );
    return getAddressFromPubKey(receivePubKey, account.addressType, currentBitcoinNetwork);
  }
};
