/* global cy */

import { Multisig } from "../../../src/__tests__/fixtures";

describe("Multisig", () => {
  it("creates a 2-of-3 multisig wallet", () => {
    const ACCOUNT_NAME = "My Multisignature Vault";
    cy.login();

    cy.window().then((win) => {
      win.ipcRenderer.invoke
        .withArgs("/enumerate")
        .returns(
          Multisig.config.extendedPublicKeys.map((xpub) => ({
            type: xpub.device.type,
            model: xpub.device.model,
            fingerprint: xpub.device.fingerprint,
            path: "/path/to/device",
            needs_pin_sent: false,
            needs_passphrase_sent: false,
          }))
        )
        .as("Enumerate");

      Multisig.config.extendedPublicKeys.forEach((item, index) => {
        win.ipcRenderer.invoke
          .withArgs("/xpub", Cypress.sinon.match({ path: "m/84'/0'/0'" }))
          .onCall(index)
          .returns({ xpub: item.xpub })
          .as(`xpub ${item.device.fingerprint}`);
      });
    });

    cy.contains("Add a new account").click();

    cy.contains("Multisignature Vault").click();

    cy.get("input").type(ACCOUNT_NAME);

    cy.contains("Continue").click();

    Multisig.config.extendedPublicKeys.forEach((key) => {
      cy.contains(key.device.fingerprint).click();
    });

    cy.contains("Finish adding devices").click();

    cy.get("[data-cy=required-devices").contains(1).should("be.visible");

    cy.get("[data-cy=increment-button").click();

    cy.get("[data-cy=required-devices").contains(2).should("be.visible");

    cy.contains("Confirm").click();

    cy.contains("View Accounts").click();

    cy.contains(ACCOUNT_NAME).click();

    cy.get("[data-cy=settings]").click();

    Multisig.config.extendedPublicKeys.forEach((key) => {
      cy.contains(key.device.fingerprint).should("be.visible");
    });
  });
});
