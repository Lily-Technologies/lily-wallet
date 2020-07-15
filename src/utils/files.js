import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { getUnchainedNetworkFromBjslibNetwork } from './transactions';

export const downloadFile = (file, filename) => {
  const fileUrl = URL.createObjectURL(file);

  window.ipcRenderer.send('download-item', { url: fileUrl, filename: filename })
}

export const createConfigFile = (importedDevices, accountName, config, currentBitcoinNetwork) => {
  const configCopy = { ...config };
  configCopy.isEmpty = false;

  const newKeys = importedDevices.map((device) => {
    return {
      id: uuidv4(),
      parentFingerprint: device.fingerprint,
      network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
      bip32Path: "m/0",
      xpub: device.xpub
    }
  });

  configCopy.vaults.push({
    id: uuidv4(),
    name: accountName,
    network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
    addressType: "P2WSH",
    quorum: {
      requiredSigners: 2,
      totalSigners: 3
    },
    extendedPublicKeys: newKeys
  })

  configCopy.keys.push(...newKeys);

  return configCopy;
}

export const createColdCardBlob = (importedDevices) => {
  return new Blob([`# Coldcard Multisig setup file (created by Lily Wallet on ${moment(Date.now()).format('MM/DD/YYYY')})
#
Name: ColdcardKitchen
Policy: 2 of 3
Derivation: m/48'/0'/0'/2'
Format: P2WSH

${importedDevices[0].fingerprint || importedDevices[0].parentFingerprint}: ${importedDevices[0].xpub}
${importedDevices[1].fingerprint || importedDevices[1].parentFingerprint}: ${importedDevices[1].xpub}
${importedDevices[2].fingerprint || importedDevices[2].parentFingerprint}: ${importedDevices[2].xpub}
`], { type: 'text/plain' });
}