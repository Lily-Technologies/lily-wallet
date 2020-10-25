import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { networks, Psbt } from 'bitcoinjs-lib';
import { bip32 } from "bitcoinjs-lib";
import { mnemonicToSeed } from "bip39";
import { AES } from 'crypto-js';

export const bitcoinNetworkEqual = (a, b) => {
  return a.bech32 === b.bech32;
}

export const getDerivationPath = (addressType, bip32Path, currentBitcoinNetwork) => {
  const childPubKeysBip32Path = bip32Path;
  if (addressType === 'multisig') {
    return `${getMultisigDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}`;
  } else if (addressType === 'p2sh') {
    return `${getP2shDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}`;
  } else { // p2wpkh
    return `${getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork)}/${childPubKeysBip32Path.replace('m/', '')}`;
  }
}

export const getMultisigDeriationPathForNetwork = (network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/48'/0'/0'/2'"
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/48'/1'/0'/2'"
  } else { // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'"
  }
}

export const getP2shDeriationPathForNetwork = (network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/49'/0'/0'"
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/49'/1'/0'"
  } else { // return mainnet by default...this should never run though
    return "m/49'/0'/0'"
  }
}

export const getP2wpkhDeriationPathForNetwork = (network) => {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/84'/0'/0'"
  } else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/84'/1'/0'"
  } else { // return mainnet by default...this should never run though
    return "m/84'/0'/0'"
  }
}

export const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork) => {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
}

export const containsColdcard = (devices) => {
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].type === 'coldcard') {
      return true
    }
  }
  return false;
}

// TODO: move this somewhere more logical
export const combinePsbts = (finalPsbt, signedPsbts) => {
  const psbt = finalPsbt;
  const base64SignedPsbts = signedPsbts.map((psbt) => {
    if (typeof psbt === 'object') {
      return psbt;
    } else {
      return Psbt.fromBase64(psbt);
    }
  })
  if (base64SignedPsbts.length) { // if there are signed psbts, combine them
    psbt.combine(...base64SignedPsbts);
  }
  return psbt;
}

export const formatFilename = (fileContents, currentBitcoinNetwork, fileType) => {
  if (bitcoinNetworkEqual(currentBitcoinNetwork, networks.bitcoin)) {
    return `${fileContents}-bitcoin-${moment().format('MMDDYY-hhmmss')}.${fileType}`;
  } else {
    return `${fileContents}-testnet-${moment().format('MMDDYY-hhmmss')}.${fileType}`;
  }
}

export const downloadFile = async (file, filename) => {
  try {
    console.log('file, filename: ', file, filename);
    await window.ipcRenderer.invoke('/download-item', { data: file, filename: filename })
  } catch (e) {
    console.log('e: ', e);
  }
}

export const saveConfig = async (configFile, password) => {
  const encryptedConfigObject = AES.encrypt(JSON.stringify(configFile), password).toString();
  try {
    await window.ipcRenderer.invoke('/save-config', { encryptedConfigFile: encryptedConfigObject })
  } catch (e) {
    console.log('e: ', e);
  }
}

export const createSinglesigConfigFile = async (walletMnemonic, accountName, config, currentBitcoinNetwork) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  // taken from BlueWallet so you can import and use on mobile
  const seed = await mnemonicToSeed(walletMnemonic);
  const root = bip32.fromSeed(seed, currentBitcoinNetwork);
  const path = getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork);
  const child = root.derivePath(path).neutered();
  const xpubString = child.toBase58();
  const xprvString = root.derivePath(path).toBase58();

  const newKey = {
    id: uuidv4(),
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: "P2WPKH",
    quorum: { requiredSigners: 1, totalSigners: 1 },
    xpub: xpubString,
    xprv: xprvString,
    mnemonic: walletMnemonic,
    parentFingerprint: root.fingerprint,
  };

  configCopy.wallets.push(newKey);

  return configCopy;
}

export const createSinglesigHWWConfigFile = async (device, accountName, config, currentBitcoinNetwork) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  const newKey = {
    id: uuidv4(),
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: "P2WPKH",
    quorum: { requiredSigners: 1, totalSigners: 1 },
    xpub: device.xpub,
    parentFingerprint: device.fingerprint,
    device: {
      type: device.type,
      model: device.model,
      fingerprint: device.fingerprint
    }
  };

  configCopy.wallets.push(newKey);

  return configCopy;
}

export const createMultisigConfigFile = (importedDevices, requiredSigners, accountName, config, currentBitcoinNetwork) => {
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
        fingerprint: device.fingerprint
      }
    }
  });

  configCopy.vaults.push({
    id: uuidv4(),
    created_at: Date.now(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: "P2WSH",
    quorum: {
      requiredSigners: requiredSigners,
      totalSigners: importedDevices.length
    },
    extendedPublicKeys: newKeys
  })

  return configCopy;
}

export const createColdCardBlob = (requiredSigners, totalSigners, accountName, importedDevices, currentBitcoinNetwork) => {
  let derivationPath = getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
  return `# Coldcard Multisig setup file (created by Lily Wallet on ${moment(Date.now()).format('MM/DD/YYYY')})
#
Name: ${accountName}
Policy: ${requiredSigners} of ${totalSigners}
Derivation: ${derivationPath}
Format: P2WSH
${importedDevices.map((device) => (
    `\n${device.fingerprint || device.parentFingerprint}: ${device.xpub}`
  ))}
`;
}