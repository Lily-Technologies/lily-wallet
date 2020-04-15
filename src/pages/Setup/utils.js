import moment from 'moment';

export const createCaravanImportFile = (importedDevices) => {
  const contentType = "application/json;charset=utf-8;";

  const caravanObject = {
    name: "Coldcard Kitchen",
    addressType: "P2WSH",
    network: "testnet",
    client: {
      type: "public"
    },
    quorum: {
      requiredSigners: 2,
      totalSigners: 3
    }
  };
  caravanObject.extendedPublicKeys = importedDevices.map((device) => {
    return {
      name: device.fingerprint,
      bip32Path: "m/0",
      xpub: device.xpub,
      method: "xpub"
    }
  });

  var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(caravanObject)))], { type: contentType });
  return blob;
}

export const createColdCardBlob = (importedDevices) => {
  return new Blob([`# Coldcard Multisig setup file (created by Coldcard Kitchen on ${moment(Date.now()).format('MM/DD/YYYY')})
#
Name: ColdcardKitchen
Policy: 2 of 3
Derivation: m/48'/1'/0'/2'
Format: P2WSH

${importedDevices[0].fingerprint}: ${importedDevices[0].xpub}
${importedDevices[1].fingerprint}: ${importedDevices[1].xpub}
${importedDevices[2].fingerprint}: ${importedDevices[2].xpub}
`], { type: 'text/plain' });
}

export const downloadFile = (file, filename) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}