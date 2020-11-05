import { networks } from 'bitcoinjs-lib';

import { getAddressFromAccount } from '../../utils/transactions';

import MultisigAccount from '../fixtures/Multisig-Account.json';
import MultisigAddresses from '../fixtures/Multisig-AddressArray.json';
import MultisigChangeAddresses from '../fixtures/Multisig-ChangeAddressArray.json';

const toBuffer = (obj) => {
  return Buffer.from(Object.values(obj));
}

const formatAddress = (address) => ({
  ...address,
  hash: toBuffer(address.hash),
  output: toBuffer(address.output),
  redeem: {
    ...address.redeem,
    output: toBuffer(address.redeem.output),
    pubkeys: address.redeem.pubkeys.map((pubkey) => toBuffer(pubkey))
  },
  bip32derivation: address.bip32derivation.map((deriv) => ({
    masterFingerprint: toBuffer(deriv.masterFingerprint),
    pubkey: toBuffer(deriv.pubkey),
    path: deriv.path
  }))
});

describe('utils - transaction', () => {
  test('Multisig - external getAddressFromAccount', () => {
    const addresses = [];
    for (let i = 0; i < 4; i++) {
      addresses.push(getAddressFromAccount(MultisigAccount.config, `m/0/${i}`, networks.bitcoin));
    }

    addresses.forEach((address, i) => {
      expect(address).toEqual(formatAddress(MultisigAddresses[i]))
    })
  });

  test('Multisig - change getAddressFromAccount', () => {
    const addresses = [];
    for (let i = 0; i < 4; i++) {
      addresses.push(getAddressFromAccount(MultisigAccount.config, `m/1/${i}`, networks.bitcoin));
    }

    addresses.forEach((address, i) => {
      expect(address).toEqual(formatAddress(MultisigChangeAddresses[i]))
    })
  });
})

