/* global cy */

import { Multisig } from "../../../src/__tests__/fixtures";

describe("Vault - Settings", () => {
  beforeEach(() => {
    cy.login();
  });

  it("can view transaction details", () => {
    cy.contains(Multisig.config.name).click();

    cy.contains(Multisig.transactions[0].address).click();

    cy.contains("Transaction Details").should("be.visible");

    cy.contains(Multisig.transactions[0].txid).should("be.visible");
  });

  it("can open tx in blockstream explorer", () => {
    cy.window().then((win) => {
      cy.stub(win, "open").as("viewInExplorer");
    });

    cy.contains(Multisig.config.name).click();

    cy.contains(Multisig.transactions[0].address).click();

    cy.contains("Transaction Details").should("be.visible");

    cy.contains("View on Blockstream").click();

    cy.get("@viewInExplorer").should(
      "be.calledWith",
      "https://blockstream.info/tx/6a37b8a2b06ad68fc5817b728aec1e2509a2b3195d4a62a147d58a8125d2ef33",
      "_blank",
      "nodeIntegration=no"
    );
  });
});
