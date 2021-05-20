/* global cy */

describe("Mnemonic", () => {
  it("creates a new mnemonic wallet", () => {
    const ACCOUNT_NAME = "My Mnemonic Wallet";

    cy.login();

    cy.contains("Add a new account").click();

    cy.get("#page-wrapper").find("#options-menu").click();

    cy.contains("New Software Wallet").click();

    cy.get("input").type(ACCOUNT_NAME);

    cy.contains("Continue").click();

    cy.contains("I have written these words down").click();

    cy.contains("View Accounts").click();

    cy.contains(ACCOUNT_NAME).click();

    cy.get("[data-cy=settings]").click();

    cy.contains("Lily").should("be.visible");
  });
});
