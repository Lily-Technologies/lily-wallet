import { v4 as uuidv4 } from 'uuid';
import { networks, Network } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import { mnemonicToSeed } from 'bip39';
import { AES, MD5 } from 'crypto-js';
import moment from 'moment';

import { bufferToHex } from 'src/utils/other';
import { createMap } from 'src/utils/accountMap';

import {
  LilyConfig,
  LilyLicense,
  OnChainConfig,
  OnChainConfigWithoutId,
  AddressType,
  Device,
  ExtendedPublicKey,
  HwiEnumerateWithXpubResponse,
  VaultConfig,
  AccountId,
  KeyId,
  LightningConfig
} from '@lily/types';

import { BasePlatform } from 'src/frontend-middleware';

const bip32 = BIP32Factory(ecc);

export function clone<T>(a: T): T {
  return JSON.parse(JSON.stringify(a));
}

export const createAccountId = (config: Omit<OnChainConfig, 'id'>): AccountId => {
  const preHashId = `${config.addressType}:${config.quorum.requiredSigners}:${
    config.quorum.totalSigners
  }:${config.extendedPublicKeys
    // sort xpubs alphabetically to catch case where imported in different order
    .sort((a, b) => (a.xpub > b.xpub ? -1 : a.xpub < b.xpub ? 1 : 0))
    .map((xpub) => xpub.xpub)
    .join(',')}`;
  console.log('createAccountId preHashId: ', preHashId);
  const idHashed = MD5(preHashId).toString();
  console.log('createAccountId idHashed: ', idHashed);
  return idHashed;
};

export const createKeyId = (fingerprint: string, xpub: string): KeyId => {
  const preHashId = `${fingerprint}:${xpub}`;
  const idHashed = MD5(preHashId).toString();
  console.log('createKeyId idHashed: ', idHashed);
  return idHashed;
};

export const validateConfig = (newAccount: VaultConfig | OnChainConfig, config: LilyConfig) => {
  const allAccounts = [...config.vaults, ...config.wallets];
  const accountMap = createMap(allAccounts, 'id');

  if (accountMap[newAccount.id]) {
    throw Error(`This account already exists #${newAccount.id}`);
  }

  return true;
};

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

export const getUnchainedNetworkFromBjslibNetwork = (
  bitcoinJslibNetwork: Network
): 'mainnet' | 'testnet' => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
};

export const multisigDeviceToExtendedPublicKey = (
  device: HwiEnumerateWithXpubResponse,
  currentBitcoinNetwork: Network
): ExtendedPublicKey => {
  const keyId = createKeyId(device.fingerprint, device.xpub);
  return {
    id: keyId,
    created_at: Date.now(),
    parentFingerprint: device.fingerprint,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    bip32Path: getMultisigDeriationPathForNetwork(currentBitcoinNetwork),
    xpub: device.xpub,
    device: {
      type: device.type,
      fingerprint: device.fingerprint,
      model: device.model
    }
  };
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
  newAccountInputs: OnChainConfigWithoutId,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = clone(config);
  configCopy.isEmpty = false;

  // taken from BlueWallet so you can import and use on mobile
  const seed = await mnemonicToSeed(newAccountInputs.mnemonic!);
  const root = bip32.fromSeed(seed, currentBitcoinNetwork);
  const path = getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork);
  const child = root.derivePath(path).neutered();
  const xpubString = child.toBase58();

  const newAccountWithoutId: Omit<OnChainConfig, 'id'> = {
    created_at: Date.now(),
    type: 'onchain' as 'onchain',
    name: newAccountInputs.name,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.P2WPKH,
    quorum: { requiredSigners: 1, totalSigners: 1 },
    extendedPublicKeys: [
      {
        id: createKeyId(bufferToHex(root.fingerprint), xpubString),
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
    mnemonic: newAccountInputs.mnemonic!
  };

  const newAccount: OnChainConfig = {
    id: createAccountId(newAccountWithoutId),
    ...newAccountWithoutId
  };

  validateConfig(newAccount, config);

  configCopy.wallets.push(newAccount);

  return configCopy;
};

export const createSinglesigHWWConfigFile = (
  newAccountInputs: OnChainConfigWithoutId,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = clone(config);
  configCopy.isEmpty = false;

  // if single sig. extendedPublicKeys will only be one item
  const { device, xpub, bip32Path } = newAccountInputs.extendedPublicKeys[0];
  const keyId = createKeyId(device.fingerprint, xpub);

  const newAccountWithoutId: Omit<OnChainConfig, 'id'> = {
    type: 'onchain',
    created_at: Date.now(),
    name: newAccountInputs.name,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: newAccountInputs.addressType,
    quorum: { requiredSigners: 1, totalSigners: 1 },
    extendedPublicKeys: [
      {
        id: keyId,
        created_at: Date.now(),
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        bip32Path: bip32Path,
        xpub: xpub,
        parentFingerprint: device.fingerprint,
        device: {
          type: device.type,
          model: device.model,
          fingerprint: device.fingerprint
        }
      }
    ]
  };

  const newAccount: OnChainConfig = {
    id: createAccountId(newAccountWithoutId),
    ...newAccountWithoutId
  };

  validateConfig(newAccount, config);

  configCopy.wallets.push(newAccount);

  return configCopy;
};

export const createMultisigConfigFile = (
  newAccountInputs: OnChainConfigWithoutId,
  config: LilyConfig,
  currentBlockHeight: number,
  currentBitcoinNetwork: Network
): LilyConfig => {
  const configCopy = clone(config);
  configCopy.isEmpty = false;

  const newKeys: ExtendedPublicKey[] = newAccountInputs.extendedPublicKeys.map(
    (extendedPublicKey) => {
      const { device, xpub } = extendedPublicKey;
      const keyId = createKeyId(device.fingerprint, xpub);
      return {
        id: keyId,
        created_at: Date.now(),
        parentFingerprint: device.fingerprint,
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        bip32Path: getMultisigDeriationPathForNetwork(currentBitcoinNetwork),
        xpub: xpub,
        device: {
          type: device.type,
          model: device.model,
          fingerprint: device.fingerprint
        }
      };
    }
  );

  const newAccountWithoutId: Omit<VaultConfig, 'id'> = {
    type: 'onchain',
    created_at: Date.now(),
    name: newAccountInputs.name,
    license: {
      license: `trial:${currentBlockHeight + 4320}`, // one month free trial (6 * 24 * 30)
      signature: ''
    },
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.P2WSH,
    quorum: {
      requiredSigners: newAccountInputs.quorum.requiredSigners,
      totalSigners: newAccountInputs.extendedPublicKeys.length
    },
    extendedPublicKeys: newKeys
  };

  const newAccount: VaultConfig = {
    id: createAccountId(newAccountWithoutId),
    ...newAccountWithoutId
  };

  validateConfig(newAccount, configCopy);

  configCopy.vaults.push(newAccount);

  return configCopy;
};

export const createLightningConfigFile = (
  newAccountInputs: LightningConfig,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  configCopy.lightning.push({
    id: uuidv4(), // allow uuid for lightning
    type: 'lightning',
    created_at: Date.now(),
    name: newAccountInputs.name,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    connectionDetails: newAccountInputs.connectionDetails
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
