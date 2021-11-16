import { v4 as uuidv4 } from 'uuid';
import { networks, Network } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import { mnemonicToSeed } from 'bip39';
import { AES } from 'crypto-js';
import moment from 'moment';

import { bufferToHex } from 'src/utils/other';

import {
  LilyConfig,
  LilyLicense,
  OnChainConfig,
  AddressType,
  Device,
  ExtendedPublicKey,
  HwiResponseEnumerate,
  VaultConfig
} from '@lily/types';

import { BasePlatform } from 'src/frontend-middleware';

const bip32 = BIP32Factory(ecc);

export const bitcoinNetworkEqual = (a: Network, b: Network) => {
  return a.bech32 === b.bech32;
};

export const getMultisigDeriationPathForNetwork = (network: Network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/48'/0'/0'/2'";
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/48'/1'/0'/2'";
  } else {
    // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'";
  }
};

export const getP2shDeriationPathForNetwork = (network: Network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/49'/0'/0'";
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/49'/1'/0'";
  } else {
    // return mainnet by default...this should never run though
    return "m/49'/0'/0'";
  }
};

export const getP2wpkhDeriationPathForNetwork = (network: Network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/84'/0'/0'";
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/84'/1'/0'";
  } else {
    // return mainnet by default...this should never run though
    return "m/84'/0'/0'";
  }
};

export const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork: Network) => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
};

export const containsColdcard = (devices: Device[]) => {
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].type === 'coldcard') {
      return true;
    }
  }
  return false;
};

export const formatFilename = (
  fileName: string,
  currentBitcoinNetwork: Network,
  fileType: string
) => {
  if (bitcoinNetworkEqual(currentBitcoinNetwork, networks.bitcoin)) {
    return `${fileName}-bitcoin-${moment().format('MMDDYY-hhmmss')}.${fileType}`;
  } else {
    return `${fileName}-testnet-${moment().format('MMDDYY-hhmmss')}.${fileType}`;
  }
};

export const downloadFile = async (file: string, filename: string, platform: BasePlatform) => {
  try {
    await platform.downloadFile(file, filename);
  } catch (e) {
    console.log('e: ', e);
  }
};

export const saveConfig = async (
  configFile: LilyConfig,
  password: string,
  platform: BasePlatform
) => {
  const encryptedConfigObject = AES.encrypt(JSON.stringify(configFile), password).toString();
  try {
    await platform.saveConfig(encryptedConfigObject);
  } catch (e) {
    console.log('e: ', e);
  }
};

export const saveLicenseToVault = async (
  accountConfig: VaultConfig,
  license: LilyLicense,
  config: LilyConfig,
  password: string,
  platform: BasePlatform
) => {
  const configCopy = { ...config };

  configCopy.vaults = configCopy.vaults.filter((item) => item.id !== accountConfig.id);

  const updatedAccountConfig = {
    ...accountConfig,
    license: license
  };
  configCopy.vaults.push(updatedAccountConfig);
  await saveConfig(configCopy, password, platform);
  return configCopy;
};

export const createSinglesigConfigFile = async (
  walletMnemonic: string,
  accountName: string,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  // taken from BlueWallet so you can import and use on mobile
  const seed = await mnemonicToSeed(walletMnemonic);
  const root = bip32.fromSeed(seed, currentBitcoinNetwork);
  const path = getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork);
  const child = root.derivePath(path).neutered();
  const xpubString = child.toBase58();

  const newKey = {
    id: uuidv4(),
    created_at: Date.now(),
    type: 'onchain',
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.P2WPKH,
    quorum: { requiredSigners: 1, totalSigners: 1 },
    extendedPublicKeys: [
      {
        id: uuidv4(),
        created_at: Date.now(),
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        bip32Path: getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork),
        xpub: xpubString,
        parentFingerprint: bufferToHex(root.fingerprint),
        device: {
          type: 'lily',
          model: 'lily',
          fingerprint: bufferToHex(root.fingerprint)
        }
      }
    ],
    mnemonic: walletMnemonic
  } as OnChainConfig;

  configCopy.wallets.push(newKey);

  return configCopy;
};

export const createSinglesigHWWConfigFile = async (
  device: HwiResponseEnumerate,
  addressType: AddressType,
  path: string,
  accountName: string,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  const newKey = {
    id: uuidv4(),
    type: 'onchain',
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: addressType,
    quorum: { requiredSigners: 1, totalSigners: 1 },
    extendedPublicKeys: [
      {
        id: uuidv4(),
        created_at: Date.now(),
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        bip32Path: path,
        xpub: device.xpub,
        parentFingerprint: device.fingerprint,
        device: {
          type: device.type,
          model: device.model,
          fingerprint: device.fingerprint
        }
      }
    ]
  } as OnChainConfig;

  configCopy.wallets.push(newKey);

  return configCopy;
};

export const createMultisigConfigFile = (
  importedDevices: HwiResponseEnumerate[],
  requiredSigners: number,
  accountName: string,
  config: LilyConfig,
  currentBlockHeight: number,
  currentBitcoinNetwork: Network
) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  const newKeys = importedDevices.map((device) => {
    return {
      id: uuidv4(),
      created_at: Date.now(),
      parentFingerprint: device.fingerprint,
      network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
      bip32Path: getMultisigDeriationPathForNetwork(currentBitcoinNetwork),
      xpub: device.xpub,
      device: {
        type: device.type,
        model: device.model,
        fingerprint: device.fingerprint
      }
    } as ExtendedPublicKey;
  });

  configCopy.vaults.push({
    id: uuidv4(),
    type: 'onchain',
    created_at: Date.now(),
    name: accountName,
    license: {
      license: `trial:${currentBlockHeight + 4320}`, // one month free trial (6 * 24 * 30)
      signature: ''
    },
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.P2WSH,
    quorum: {
      requiredSigners: requiredSigners,
      totalSigners: importedDevices.length
    },
    extendedPublicKeys: newKeys
  });

  return configCopy;
};

export const createLightningConfigFile = (
  lndConnectUri: string,
  accountName: string,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  configCopy.lightning.push({
    id: uuidv4(),
    type: 'lightning',
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    connectionDetails: {
      lndConnectUri
    }
  });

  return configCopy;
};

export const createColdCardBlob = (
  requiredSigners: number,
  totalSigners: number,
  accountName: string,
  importedDevices: ExtendedPublicKey[],
  currentBitcoinNetwork: Network
) => {
  let derivationPath = getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
  return `# Coldcard Multisig setup file (created by Lily Wallet on ${moment(Date.now()).format(
    'MM/DD/YYYY'
  )})
#
Name: ${accountName}
Policy: ${requiredSigners} of ${totalSigners}
Derivation: ${derivationPath}
Format: P2WSH
${importedDevices.map((device) => `\n${device.parentFingerprint}: ${device.xpub}`).join('')}
`;
};
