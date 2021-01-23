import { v4 as uuidv4 } from "uuid";
import { networks, Network } from "bitcoinjs-lib";
import { bip32 } from "bitcoinjs-lib";
import { mnemonicToSeed } from "bip39";
import { AES } from "crypto-js";
import moment from "moment";

import { bufferToHex } from "../utils/other";

import {
  LilyConfig,
  LilyLicense,
  OldLilyConfig,
  AccountConfig,
  AddressType,
  Device,
  ExtendedPublicKey,
  HwiResponseEnumerate,
} from "../types";

export const bitcoinNetworkEqual = (a: Network, b: Network) => {
  return a.bech32 === b.bech32;
};

export const getDerivationPath = (
  addressType: AddressType,
  bip32Path: string,
  currentBitcoinNetwork: Network
) => {
  const childPubKeysBip32Path = bip32Path;
  if (addressType === "multisig") {
    return `${getMultisigDeriationPathForNetwork(
      currentBitcoinNetwork
    )}/${childPubKeysBip32Path.replace("m/", "")}`;
  } else if (addressType === "p2sh") {
    return `${getP2shDeriationPathForNetwork(
      currentBitcoinNetwork
    )}/${childPubKeysBip32Path.replace("m/", "")}`;
  } else {
    // p2wpkh
    return `${getP2wpkhDeriationPathForNetwork(
      currentBitcoinNetwork
    )}/${childPubKeysBip32Path.replace("m/", "")}`;
  }
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
) => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return "mainnet";
  } else {
    return "testnet";
  }
};

export const containsColdcard = (devices: Device[]) => {
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].type === "coldcard") {
      return true;
    }
  }
  return false;
};

export const updateConfigFileVersion = (
  config: OldLilyConfig,
  currentBlockHeight: number
) => {
  if (config.version === "0.0.1" || config.version === "0.0.2") {
    const updatedConfig = {
      name: "",
      version: "1.0.0",
      isEmpty: false,
      license: {
        license: `trial:${currentBlockHeight + 4320}`, // one month free trial (6 * 24 * 30)
        signature: "",
      },
      wallets: config.wallets.map((item) => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        network: item.network,
        addressType: item.addressType,
        quorum: item.quorum,
        extendedPublicKeys: [
          {
            id: uuidv4(),
            created_at: item.created_at,
            parentFingerprint: item.parentFingerprint,
            xpub: item.xpub,
            network: item.network,
            bip32Path: "m/0",
            device: item.device || {
              type: "lily",
              model: "lily",
              fingerprint: item.parentFingerprint,
            },
          },
        ],
        mnemonic: item.mnemonic,
        parentFingerprint: item.parentFingerprint,
      })),
      vaults: config.vaults.map((item) => ({
        ...item,
      })),
    } as LilyConfig;
    return updatedConfig;
  }
  return config;
};

export const formatFilename = (
  fileName: string,
  currentBitcoinNetwork: Network,
  fileType: string
) => {
  if (bitcoinNetworkEqual(currentBitcoinNetwork, networks.bitcoin)) {
    return `${fileName}-bitcoin-${moment().format(
      "MMDDYY-hhmmss"
    )}.${fileType}`;
  } else {
    return `${fileName}-testnet-${moment().format(
      "MMDDYY-hhmmss"
    )}.${fileType}`;
  }
};

export const downloadFile = async (file: string, filename: string) => {
  try {
    await window.ipcRenderer.invoke("/download-item", {
      data: file,
      filename: filename,
    });
  } catch (e) {
    console.log("e: ", e);
  }
};

export const saveConfig = async (configFile: LilyConfig, password: string) => {
  const encryptedConfigObject = AES.encrypt(
    JSON.stringify(configFile),
    password
  ).toString();
  try {
    await window.ipcRenderer.invoke("/save-config", {
      encryptedConfigFile: encryptedConfigObject,
    });
  } catch (e) {
    console.log("e: ", e);
  }
};

export const saveLicenseToConfig = async (
  license: LilyLicense,
  configFile: LilyConfig,
  password: string
) => {
  const configCopy = { ...configFile };
  configCopy.license = license;
  await saveConfig(configCopy, password);
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
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.P2WPKH,
    quorum: { requiredSigners: 1, totalSigners: 1 },
    extendedPublicKeys: [
      {
        id: uuidv4(),
        created_at: Date.now(),
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        bip32Path: "m/0",
        xpub: xpubString,
        parentFingerprint: bufferToHex(root.fingerprint),
        device: {
          type: "lily",
          model: "lily",
          fingerprint: bufferToHex(root.fingerprint),
        },
      },
    ],
    mnemonic: walletMnemonic,
  } as AccountConfig;

  configCopy.wallets.push(newKey);

  return configCopy;
};

export const createSinglesigHWWConfigFile = async (
  device: HwiResponseEnumerate,
  accountName: string,
  config: LilyConfig,
  currentBitcoinNetwork: Network
) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  const newKey = {
    id: uuidv4(),
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.p2sh,
    quorum: { requiredSigners: 1, totalSigners: 1 },
    extendedPublicKeys: [
      {
        id: uuidv4(),
        created_at: Date.now(),
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        bip32Path: "m/0",
        xpub: device.xpub,
        parentFingerprint: device.fingerprint,
        device: {
          type: device.type,
          model: device.model,
          fingerprint: device.fingerprint,
        },
      },
    ],
  } as AccountConfig;

  configCopy.wallets.push(newKey);

  return configCopy;
};

export const createMultisigConfigFile = (
  importedDevices: HwiResponseEnumerate[],
  requiredSigners: number,
  accountName: string,
  config: LilyConfig,
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
      bip32Path: "m/0",
      xpub: device.xpub,
      device: {
        type: device.type,
        model: device.model,
        fingerprint: device.fingerprint,
      },
    } as ExtendedPublicKey;
  });

  configCopy.vaults.push({
    id: uuidv4(),
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: AddressType.P2WSH,
    quorum: {
      requiredSigners: requiredSigners,
      totalSigners: importedDevices.length,
    },
    extendedPublicKeys: newKeys,
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
  let derivationPath = getMultisigDeriationPathForNetwork(
    currentBitcoinNetwork
  );
  return `# Coldcard Multisig setup file (created by Lily Wallet on ${moment(
    Date.now()
  ).format("MM/DD/YYYY")})
#
Name: ${accountName}
Policy: ${requiredSigners} of ${totalSigners}
Derivation: ${derivationPath}
Format: P2WSH
${importedDevices
  .map((device) => `\n${device.parentFingerprint}: ${device.xpub}`)
  .join("")}
`;
};
