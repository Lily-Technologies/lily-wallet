import axios from 'axios';
import { Psbt, Transaction, bip32, networks } from 'bitcoinjs-lib';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  TESTNET
} from "unchained-bitcoin";

const getUTXOByAddress = (txFromBlockstream, scriptPubKeyAddress) => {
  return txFromBlockstream.vout.filter((out) => out.scriptpubkey_address === scriptPubKeyAddress)[0];
}

export const constructPsbt = async (
  caravanFile,
  scriptPubKeyAddress,
  witnessScript,
  unsignedTransaction,
  bip32path
) => {
  console.log('mmmm: ', caravanFile,
    scriptPubKeyAddress,
    witnessScript,
    unsignedTransaction);
  const PATH_FROM_XPUB = bip32path;
  const PATH_FROM_MASTER_XPUB = `m/48'/1'/0'/2'/${PATH_FROM_XPUB.replace('m/', '')}`;
  console.log('PATH_FROM_XPUB: ', PATH_FROM_XPUB);
  console.log('PATH_FROM_MASTER_XPUB: ', PATH_FROM_MASTER_XPUB);


  const JB_XPUB = "tpubD6NzVbkrYhZ4Yos4KiTCexKCkKGmzLwfExUXxXE2qq8ky9Ky9uZE1Xbctzk2rhduQntdCeg47MLRQ7zM1rUAH3RHRaSFHfHpyrvLb5Fzrg9"; // xfp (9130C3D6)
  const DAS_XPUB = "tpubD6NzVbkrYhZ4XBQLfAgvNCzqCbKu3ZpRJqMPBxYBn7Gw92P9tF8xxQicgEWpSeT3seaFAVwcdc1Wo5DK7fJRi2qPDtSENyzAfbP9xNKnT86"; // xfp (34ECF56B)
  const SUNNY_XPUB = "tpubD6NzVbkrYhZ4XLEhtbB4e4AbTH4ZbXB77Nuu23WGDwyHa6S8EfWpnx268EWP4wQhas1N9ByWSCsPvjh9ArmNk2NnoXaSFioxw29z6z1xNbe"; // xfp (4F60D1C9)

  console.log('xx1: ', deriveChildPublicKey(caravanFile.extendedPublicKeys[0].xpub, PATH_FROM_XPUB, TESTNET));
  console.log('xx1: ', deriveChildPublicKey(caravanFile.extendedPublicKeys[1].xpub, PATH_FROM_XPUB, TESTNET));
  console.log('xx1: ', deriveChildPublicKey(caravanFile.extendedPublicKeys[2].xpub, PATH_FROM_XPUB, TESTNET));
  // console.log('xx2: ', deriveChildPublicKey(JB_XPUB, PATH_FROM_MASTER_XPUB, TESTNET));
  // console.log('xx3: ', deriveChildPublicKey(DAS_XPUB, PATH_FROM_MASTER_XPUB, TESTNET));
  // console.log('xx4: ', deriveChildPublicKey(SUNNY_XPUB, PATH_FROM_MASTER_XPUB, TESTNET));

  const tx = Transaction.fromHex(unsignedTransaction);

  const psbt = new Psbt();
  psbt.setVersion(2);
  psbt.setLocktime(0);

  for (let i = 0; i < tx.ins.length; i++) {
    const txId = tx.ins[i].hash.reverse().toString('hex');
    const txFromBlockstream = await (await axios.get(blockExplorerAPIURL(`/tx/${txId}`, TESTNET))).data;

    const inputUtxo = getUTXOByAddress(txFromBlockstream, scriptPubKeyAddress);

    psbt.addInput({
      hash: Buffer.from(tx.ins[i].hash, 'hex').toString('hex'),
      index: tx.ins[i].index,
      sequence: tx.ins[i].sequence,
      witnessUtxo: {
        script: Buffer.from(
          inputUtxo.scriptpubkey,
          'hex'
        ),
        value: inputUtxo.value
      },
      witnessScript: Buffer.from(witnessScript, 'hex'),
      bip32Derivation: [
        // I have these ordered by pubkey...not sure if necessary
        {
          masterFingerprint: Buffer.from(caravanFile.extendedPublicKeys[0].name, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(caravanFile.extendedPublicKeys[0].xpub, PATH_FROM_XPUB, TESTNET), 'hex'),
          path: PATH_FROM_MASTER_XPUB,
        },
        {
          masterFingerprint: Buffer.from(caravanFile.extendedPublicKeys[1].name, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(caravanFile.extendedPublicKeys[1].xpub, PATH_FROM_XPUB, TESTNET), 'hex'),
          path: PATH_FROM_MASTER_XPUB,
        },
        {
          masterFingerprint: Buffer.from(caravanFile.extendedPublicKeys[2].name, 'hex'),
          pubkey: Buffer.from(deriveChildPublicKey(caravanFile.extendedPublicKeys[2].xpub, PATH_FROM_XPUB, TESTNET), 'hex'),
          path: PATH_FROM_MASTER_XPUB,
        },
      ]
    });
  }


  for (let j = 0; j < tx.outs.length; j++) {
    psbt.addOutput({
      redeemScript: tx.outs[j].script,
      script: tx.outs[j].script,
      value: tx.outs[j].value
    });
  }

  console.log('psbt hex base64: ', psbt.toBase64());
  return psbt;
}