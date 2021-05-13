import { networks } from "bitcoinjs-lib";
import HistoricalBtcPriceFixture from "../fixtures/historical-btc-price.json";
import { createConfig } from "./createConfig";

import { Multisig } from "../../src/__tests__/fixtures";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.on("window:before:load", (win) => {
//   win.ipcRenderer = {
//     invoke: () => null,
//     send: () => null,
//     on: () => null,
//   };
// });

const PASSWORD = "testtest";
Cypress.Commands.add("login", () => {
  cy.visit("http://localhost:3001/login", {
    onBeforeLoad: (win) => {
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

      const onStub = cy
        .stub()
        .callsFake((args, args1) => {
          // setTimeout so that initialAccountMap can get set
          // this mimicks a delay for constructing the accountMap
          setTimeout(() => {
            const multisigAccount = {
              name: Multisig.config.name,
              config: Multisig.config,
              addresses: Multisig.addresses,
              changeAddresses: Multisig.changeAddresses,
              availableUtxos: Multisig.availableUtxos,
              transactions: Multisig.transactions,
              unusedAddresses: Multisig.unusedAddresses,
              unusedChangeAddresses: Multisig.unusedChangeAddresses,
              currentBalance: 29595127,
              loading: false,
            };
            args1(undefined, multisigAccount);
          }, 1000);
        })
        .as("account-data");

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
});
