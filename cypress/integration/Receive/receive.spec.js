/* global cy */

import { Multisig } from "../../../src/__tests__/fixtures";

describe("Receive", () => {
  beforeEach(() => {
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
