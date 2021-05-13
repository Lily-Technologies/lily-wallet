import { networks } from "bitcoinjs-lib";

import { Address } from "../../types";

import assert from "assert";
import { original, addresses } from "../fixtures/serializeTransactions.json";
const { external, change } = addresses;

import { Multisig } from "../fixtures";

import {
  getAddressFromAccount,
  serializeTransactions,
} from "../../utils/accountMap";

const toBuffer = (obj: any) => {
  return Buffer.from(Object.values(obj));
};

// convert appropriate fields to buffer
const formatAddress = (address: any) => ({
  ...address,
  hash: toBuffer(address.hash),
  output: toBuffer(address.output),
  redeem: {
    ...address.redeem,
    output: toBuffer(address.redeem.output),
    pubkeys: address.redeem.pubkeys.map((pubkey: any) => toBuffer(pubkey)),
  },
  bip32derivation: address.bip32derivation.map((deriv) => ({
    masterFingerprint: toBuffer(deriv.masterFingerprint),
    pubkey: toBuffer(deriv.pubkey),
    path: deriv.path,
  })),
});

describe("accountMap", function () {
  test("#serializeTransactions", function () {
    const txs = serializeTransactions(original, external, change);
    // Testing expected tx 'type' attributes
    assert.strictEqual(txs[4].type, "received");
    assert.strictEqual(txs[3].type, "moved");
    assert.strictEqual(txs[2].type, "moved");
    assert.strictEqual(txs[1].type, "moved");
    assert.strictEqual(txs[0].type, "sent");
    // Testing expected balance
    assert.strictEqual(txs[4].totalValue, 1000000);
    assert.strictEqual(txs[3].totalValue, 997288);
    assert.strictEqual(txs[2].totalValue, 994802);
    assert.strictEqual(txs[1].totalValue, 989830);
    assert.strictEqual(txs[0].totalValue, 884858);
  });

  test("Multisig - external getAddressFromAccount", () => {
    const addresses = [];
    for (let i = 0; i < 4; i++) {
      addresses.push(
        getAddressFromAccount(Multisig.config, `m/0/${i}`, networks.bitcoin)
      );
    }

    addresses.forEach((address, i) => {
      expect(address).toEqual(formatAddress(Multisig.addresses[i]));
    });
  });

  test("Multisig - change getAddressFromAccount", () => {
    const addresses = [];
    for (let i = 0; i < 4; i++) {
      addresses.push(
        getAddressFromAccount(Multisig.config, `m/1/${i}`, networks.bitcoin)
      );
    }

    addresses.forEach((address, i) => {
      expect(address).toEqual(formatAddress(Multisig.changeAddresses[i]));
    });
  });
});
