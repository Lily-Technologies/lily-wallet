/* global cy */

import { Multisig } from "../../../src/__tests__/fixtures";

describe("Settings", () => {
  beforeEach(() => {
    cy.login();
  });
  it("organizes the pages into tabs", () => {
    cy.contains("Settings").click();

    cy.contains("Network configuration").should("be.visible");

    cy.get("nav#settings-navigation").contains("Backup").click();
    cy.contains("Configuration File").should("be.visible");

    cy.get("nav#settings-navigation").contains("License").click();
    cy.contains("License Information").should("be.visible");

    cy.get("nav#settings-navigation").contains("About").click();
    cy.contains("About Lily Wallet").should("be.visible");
  });

  it("allows user to input custom node connection data", () => {
    const HOST = "https://myfake.host:8337";
    const USERNAME = "SATOSHI";
    const PASSWORD = "P2P";

    const CURRENT_BLOCK_HEIGHT = 684085;
    const PROVIDER = "Custom Node";

    cy.window().then((win) => {
      win.ipcRenderer.invoke
        .withArgs("/changeNodeConfig")
        .returns({
          blocks: CURRENT_BLOCK_HEIGHT,
          initialblockdownload: false,
          provider: PROVIDER,
          baseURL: HOST,
          connected: true,
        })
        .as("changeNodeConfig");
    });

    cy.contains("Settings").click();

    cy.contains("Network configuration").should("be.visible");

    cy.contains("Change data source").click();
    cy.contains("Connect to specific node").click();

    cy.get("input#node-host").type(HOST);
    cy.get("input#node-username").type(USERNAME);
    cy.get("input#node-password").type(PASSWORD);

    cy.contains("Connect to node").click();

    cy.contains(CURRENT_BLOCK_HEIGHT.toLocaleString()).should("be.visible");
    cy.contains(HOST).should("be.visible");
    cy.contains("Connected").should("be.visible");
  });
});
