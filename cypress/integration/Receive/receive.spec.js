/* global cy */

import { Multisig } from "../../../src/__tests__/fixtures";

describe("Receive", () => {
  beforeEach(() => {
    // cy.setup();
    const PASSWORD = "testtest";

    cy.window("window:before:load", (win) => {
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
    });
    cy.login();
  });
  it("displays a receive address", () => {
    cy.contains("Receive").click();
    cy.get("nav").contains(Multisig.config.name).click();
    cy.contains(Multisig.unusedAddresses[0].address).should("be.visible");
  });

  it("can generate a new receive address", () => {
    cy.contains("Receive").click();
    cy.get("nav").contains(Multisig.config.name).click();
    cy.contains(Multisig.unusedAddresses[0].address).should("be.visible");
    cy.contains("Generate New Address").click();
    cy.contains(Multisig.unusedAddresses[1].address).should("be.visible");
  });
});
