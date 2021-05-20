/* global cy */

import { Multisig } from "../../../src/__tests__/fixtures";

describe("Vault - Settings", () => {
  beforeEach(() => {
    cy.login();
  });

  it("can edit the account name", () => {
    const NEW_ACCOUNT_NAME = "Renamed Account Name";
    cy.contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Edit").click();

    cy.get("input").type(NEW_ACCOUNT_NAME);

    cy.contains("Save").click();

    cy.contains(NEW_ACCOUNT_NAME).should("be.visible");
  });

  it("can cancel editing the account name", () => {
    const NEW_ACCOUNT_NAME = "Renamed Account Name";
    cy.contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Edit").click();

    cy.get("input").type(NEW_ACCOUNT_NAME);

    cy.contains("Cancel").click();

    cy.contains(Multisig.config.name).should("be.visible");
  });

  it("can view details about a device", () => {
    cy.contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("View details").click();

    cy.contains(Multisig.config.extendedPublicKeys[0].device.model).should(
      "be.visible"
    );
  });

  it("can delete an account", () => {
    cy.contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.get("button").contains("Delete").click();

    cy.get("input").type(Multisig.config.name);

    cy.get("button").contains("Delete Account").click();

    cy.contains(Multisig.config.name).should("not.exist");
  });
  it("can view all addresses", () => {
    cy.contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Addresses").click();

    cy.contains(Multisig.addresses[0].address).should("be.visible");
  });

  it("can view all UTXOs", () => {
    cy.contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("UTXOs").click();

    cy.contains(Multisig.availableUtxos[0].txid).should("be.visible");
  });
});
