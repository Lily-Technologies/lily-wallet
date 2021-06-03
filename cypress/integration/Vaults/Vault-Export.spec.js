/* global cy */

import { Multisig, HWW, Mnemonic } from "../../../src/__tests__/fixtures";

describe("Vault - Export", () => {
  beforeEach(() => {
    cy.login();
  });

  it("it displays the relevant export options for 2-of-3 config", () => {
    cy.get("[data-cy=nav-item]").contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("Coldcard Export File").should("be.visible");

    cy.contains("Cobo Vault File").should("be.visible");

    cy.contains("Caravan File").should("be.visible");
  });

  it("it displays the Cobo QR Code for 2-of-3 multisig setup", () => {
    cy.get("[data-cy=nav-item]").contains(Multisig.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("View QR Code").click();

    cy.contains("Scan this with your device").should("be.visible");
  });

  it("it displays the relevant export options for hardware wallet config", () => {
    cy.get("[data-cy=nav-item]").contains(HWW.account.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("Extended Public Key (XPub)").should("be.visible");
  });

  it("it displays the relevant export options for hardware wallet config", () => {
    cy.get("[data-cy=nav-item]").contains(HWW.account.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("View").click();

    cy.contains("Scan this with your device").should("be.visible");
  });

  it("it displays the relevant export options for hardware wallet config", () => {
    cy.get("[data-cy=nav-item]").contains(HWW.account.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("Extended Public Key (XPub)").should("be.visible");
  });

  it("it displays the relevant export options for mnemonic wallet config", () => {
    cy.get("[data-cy=nav-item]").contains(Mnemonic.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("Mnemonic Words").should("be.visible");
    cy.contains("Extended Public Key (XPub)").should("be.visible");
  });

  it("it displays mnemonic words for mnemonic account", () => {
    cy.get("[data-cy=nav-item]").contains(Mnemonic.config.name).click();
    cy.get("[data-cy=settings]").click();

    cy.contains("Export").click();

    cy.contains("View Words").click();
    cy.contains(Mnemonic.config.mnemonic.split(" ")[0]).should("be.visible");
  });
});
