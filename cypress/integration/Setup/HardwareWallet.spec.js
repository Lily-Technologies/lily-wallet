/* global cy */

import { DAS, JB, Sunny } from "../../../src/__tests__/fixtures";

describe("Single Hardware Wallet", () => {
  beforeEach(() => {
    cy.login();
  });
  it("sets up a hardware wallet with P2SH transasctions already", () => {
    const ACCOUNT_NAME = "P2SH Hardware Wallet";

    cy.intercept(
      {
        url: /^https:\/\/blockstream.info\/api\/address\/bc1.*/,
      },
      (req) => {
        req.continue();
      }
    ).as("P2SHP2WPKH_Blockstream");

    cy.intercept(
      {
        url: /^https:\/\/blockstream.info\/api\/address\/3.*/,
      },
      (req) => {
        req.continue();
      }
    ).as("P2WPKH_Blockstream");

    cy.window().then((win) => {
      win.ipcRenderer.invoke
        .withArgs("/enumerate")
        .returns(
          DAS.account.extendedPublicKeys.map((xpub) => ({
            type: xpub.device.type,
            model: xpub.device.model,
            fingerprint: xpub.device.fingerprint,
            path: "/path/to/device",
            needs_pin_sent: false,
            needs_passphrase_sent: false,
          }))
        )
        .as("Enumerate");

      win.ipcRenderer.invoke
        .withArgs("/xpub", Cypress.sinon.match({ path: "m/49'/0'/0'" }))
        .returns({ xpub: DAS.account.extendedPublicKeys[0].xpub })
        .as("P2SHP2WPKH_XPub");

      win.ipcRenderer.invoke
        .withArgs("/xpub", Cypress.sinon.match({ path: "m/84'/0'/0'" }))
        .returns({
          xpub: DAS.other.bip84xpub,
        })
        .as("P2WPKH_XPub");
    });

    cy.contains("Add a new account").click();

    cy.contains("Hardware Wallet").click();

    cy.get("input").type(ACCOUNT_NAME);

    cy.contains("Continue").click();

    cy.contains(DAS.account.extendedPublicKeys[0].parentFingerprint).click();

    cy.wait("@P2SHP2WPKH_Blockstream");
    cy.wait("@P2WPKH_Blockstream");

    cy.contains("Continue").click();

    cy.contains("View Accounts").click();

    cy.contains(ACCOUNT_NAME).click();

    cy.get("[data-cy=settings]").click();

    cy.contains("View details").click();

    cy.contains("m/49'/0'/0'").should("be.visible");
  });

  it("sets up a hardware wallet with P2WPK transasctions already", () => {
    const ACCOUNT_NAME = "P2WPK Hardware Wallet";

    cy.intercept(
      {
        url: /^https:\/\/blockstream.info\/api\/address\/bc1.*/,
      },
      (req) => {
        req.continue();
      }
    ).as("P2SHP2WPKH_Blockstream");

    cy.intercept(
      {
        url: /^https:\/\/blockstream.info\/api\/address\/3.*/,
      },
      (req) => {
        req.continue();
      }
    ).as("P2WPKH_Blockstream");

    cy.window().then((win) => {
      win.ipcRenderer.invoke
        .withArgs("/enumerate")
        .returns(
          JB.config.extendedPublicKeys.map((xpub) => ({
            type: xpub.device.type,
            model: xpub.device.model,
            fingerprint: xpub.device.fingerprint,
            path: "/path/to/device",
            needs_pin_sent: false,
            needs_passphrase_sent: false,
          }))
        )
        .as("Enumerate");

      win.ipcRenderer.invoke
        .withArgs("/xpub", Cypress.sinon.match({ path: "m/49'/0'/0'" }))
        .returns({ xpub: JB.config.extendedPublicKeys[0].xpub })
        .as("P2SHP2WPKH_XPub");

      win.ipcRenderer.invoke
        .withArgs("/xpub", Cypress.sinon.match({ path: "m/84'/0'/0'" }))
        .returns({
          xpub: JB.other.bip49xpub,
        })
        .as("P2WPKH_XPub");
    });

    cy.contains("Add a new account").click();

    cy.contains("Hardware Wallet").click();

    cy.get("input").type(ACCOUNT_NAME);

    cy.contains("Continue").click();

    cy.contains(JB.config.extendedPublicKeys[0].parentFingerprint).click();

    cy.wait("@P2SHP2WPKH_Blockstream");
    cy.wait("@P2WPKH_Blockstream");

    cy.contains("Continue").click();

    cy.contains("View Accounts").click();

    cy.contains(ACCOUNT_NAME).click();

    cy.get("[data-cy=settings]").click();

    cy.contains("View details").click();

    cy.contains("m/84'/0'/0'").should("be.visible");
  });
});
