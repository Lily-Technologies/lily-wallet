import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { getUnchainedNetworkFromBjslibNetwork } from './transactions';

export const downloadFile = (file, filename) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}

export const createConfigFile = (importedDevices, currentBitcoinNetwork) => {
  const vaultid = uuidv4();
  const configObject = {
    name: "",
    version: '0.0.1',
    backup_options: {
      gdrive: true
    },
    wallets: [],
    vaults: [
      {
        id: vaultid,
        name: vaultid,
        network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        addressType: "P2WSH",
        quorum: {
          requiredSigners: 2,
          totalSigners: 3
        }
      }
    ]
  }
  configObject.keys = importedDevices.map((device) => {
    return {
      id: uuidv4(),
      parentFingerprint: device.fingerprint,
      network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
      bip32Path: "m/0",
      xpub: device.xpub
    }
  });

  configObject.vaults[0].extendedPublicKeys = configObject.keys;
  return configObject;
}

export const createColdCardBlob = (importedDevices) => {
  return new Blob([`# Coldcard Multisig setup file (created by Lily Wallet on ${moment(Date.now()).format('MM/DD/YYYY')})
#
Name: ColdcardKitchen
Policy: 2 of 3
Derivation: m/48'/0'/0'/2'
Format: P2WSH

${importedDevices[0].fingerprint}: ${importedDevices[0].xpub}
${importedDevices[1].fingerprint}: ${importedDevices[1].xpub}
${importedDevices[2].fingerprint}: ${importedDevices[2].xpub}
`], { type: 'text/plain' });
}