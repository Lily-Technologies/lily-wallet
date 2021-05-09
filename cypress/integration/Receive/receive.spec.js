/* global cy */
import { networks } from "bitcoinjs-lib";
import HistoricalBtcPriceFixture from "../../fixtures/historical-btc-price.json";

import {
  MultisigAccount,
  MultisigAddresses,
  MultisigChangeAddresses,
  MultisigTransactions,
  MultisigUnusedAddresses,
  MultisigUnusedChangeAddresses,
  MultisigUTXOs,
} from "../../../src/__tests__/fixtures";

import { createConfig } from "../../support/createConfig";

describe("Receive", () => {
  it("displays a receive address", () => {
    const PASSWORD = "testtest";
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
        const invokeStub = cy.stub();
        const sendStub = cy.stub();

        const encryptedConfig = createConfig(PASSWORD);
        invokeStub.withArgs("/get-config").returns({
          file: encryptedConfig,
          modifiedTime: 123456,
        });
        invokeStub.withArgs("/get-node-config").returns({
          blocks: 687000,
          initialblockdownload: false,
          provider: "Blockstream",
          connected: true,
        });
        invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
        invokeStub
          .withArgs("/historical-btc-price")
          .returns(HistoricalBtcPriceFixture);

        invokeStub.withArgs("/save-config").as("Save Config");

        invokeStub
          .withArgs("/estimate-fee")
          .returns({ fastestFee: 2, halfHourFee: 2, hourFee: 2, minimumFee: 1 })
          .as("Estimate Fee");

        const onStub = cy.stub().callsFake((args, args1) => {
          // setTimeout so that initialAccountMap can get set
          // this mimicks a delay for constructing the accountMap
          setTimeout(() => {
            const multisigAccount = {
              name: MultisigAccount.name,
              config: MultisigAccount.config,
              addresses: MultisigAddresses.default,
              changeAddresses: MultisigChangeAddresses.default,
              availableUtxos: MultisigUTXOs.default,
              transactions: MultisigTransactions.default,
              unusedAddresses: MultisigUnusedAddresses.default,
              unusedChangeAddresses: MultisigUnusedChangeAddresses.default,
              currentBalance: 29595127,
              loading: false,
            };
            args1(undefined, multisigAccount);
          }, 500);
        });

        win.ipcRenderer = {
          invoke: invokeStub,
          on: onStub,
          send: sendStub,
        };
      },
    });

    cy.get("input").eq(1).type(PASSWORD);
    cy.get("button").contains("Unlock").click();

    cy.contains("Unlocking").should("be.visible");

    cy.wait(2500); // wait for unlocking timeout to end

    cy.contains("Current Price").should("be.visible");

    cy.contains("Receive").click();

    cy.get("nav").contains(MultisigAccount.name).click();

    cy.contains(MultisigUnusedAddresses[0].address).should("be.visible");
  });

  it("can generate a new receive address", () => {
    const PASSWORD = "testtest";
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
        const invokeStub = cy.stub();
        const sendStub = cy.stub();

        const encryptedConfig = createConfig(PASSWORD);
        invokeStub.withArgs("/get-config").returns({
          file: encryptedConfig,
          modifiedTime: 123456,
        });
        invokeStub.withArgs("/get-node-config").returns({
          blocks: 687000,
          initialblockdownload: false,
          provider: "Blockstream",
          connected: true,
        });
        invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
        invokeStub
          .withArgs("/historical-btc-price")
          .returns(HistoricalBtcPriceFixture);

        invokeStub.withArgs("/save-config").as("Save Config");

        invokeStub
          .withArgs("/estimate-fee")
          .returns({ fastestFee: 2, halfHourFee: 2, hourFee: 2, minimumFee: 1 })
          .as("Estimate Fee");

        const onStub = cy.stub().callsFake((args, args1) => {
          // setTimeout so that initialAccountMap can get set
          // this mimicks a delay for constructing the accountMap
          setTimeout(() => {
            const multisigAccount = {
              name: MultisigAccount.name,
              config: MultisigAccount.config,
              addresses: MultisigAddresses.default,
              changeAddresses: MultisigChangeAddresses.default,
              availableUtxos: MultisigUTXOs.default,
              transactions: MultisigTransactions.default,
              unusedAddresses: MultisigUnusedAddresses.default,
              unusedChangeAddresses: MultisigUnusedChangeAddresses.default,
              currentBalance: 29595127,
              loading: false,
            };
            args1(undefined, multisigAccount);
          }, 500);
        });

        win.ipcRenderer = {
          invoke: invokeStub,
          on: onStub,
          send: sendStub,
        };
      },
    });

    cy.get("input").eq(1).type(PASSWORD);
    cy.get("button").contains("Unlock").click();

    cy.contains("Unlocking").should("be.visible");

    cy.wait(2500); // wait for unlocking timeout to end

    cy.contains("Current Price").should("be.visible");

    cy.contains("Receive").click();

    cy.get("nav").contains(MultisigAccount.name).click();

    cy.contains(MultisigUnusedAddresses[0].address).should("be.visible");

    cy.contains("Generate New Address").click();

    cy.contains(MultisigUnusedAddresses[1].address).should("be.visible");
  });
});
