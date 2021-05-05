/* global cy */
import { getConfig } from "utils/files";
import { networks } from "bitcoinjs-lib";
import HistoricalBtcPriceFixture from "../../fixtures/historical-btc-price.json";
import { login } from "../../support/login";

describe("Login", () => {
  it("shows the Get Started button if no config loaded", () => {
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
        const invokeStub = cy.stub();

        invokeStub.withArgs("/get-config").returns(undefined);
        invokeStub.withArgs("/getNodeConfig").returns({
          blocks: 687000,
          initialblockdownload: false,
          provider: "Blockstream",
          connected: true,
        });
        invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
        invokeStub
          .withArgs("/historical-btc-price")
          .returns(HistoricalBtcPriceFixture);

        invokeStub.withArgs("/save-config").as("SaveConfig");

        win.ipcRenderer = {
          invoke: invokeStub,
        };
      },
    });

    cy.contains("Get Started").should("be.visible");
  });
  it("allows the user to go through the login flow with a new config", () => {
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
        const invokeStub = cy.stub();

        invokeStub.withArgs("/get-config").returns(undefined);
        invokeStub.withArgs("/getNodeConfig").returns({
          blocks: 687000,
          initialblockdownload: false,
          provider: "Blockstream",
          connected: true,
        });
        invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
        invokeStub
          .withArgs("/historical-btc-price")
          .returns(HistoricalBtcPriceFixture);

        invokeStub.withArgs("/save-config").as("SaveConfig");

        win.ipcRenderer = {
          invoke: invokeStub,
        };
      },
    });

    cy.contains("Get Started").click();
    cy.contains("Continue").should("be.visible");

    cy.get("input").eq(1).type("testtest");
    cy.get("input").eq(2).type("testtest");
    cy.contains("Continue").click();
    cy.contains("Loading").should("be.visible");
    cy.contains("Current Price").should("be.visible");
    cy.get("@SaveConfig").should("have.been.calledOnce");
  });

  it("displays Incorrect Password if user inputs incorrect password", () => {
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
        const invokeStub = cy.stub();

        invokeStub.withArgs("/get-config").returns({
          file: "abc123",
          modifiedTime: 123456,
        });

        invokeStub.withArgs("/getNodeConfig").returns({
          blocks: 687000,
          initialblockdownload: false,
          provider: "Blockstream",
          connected: true,
        });
        invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
        invokeStub
          .withArgs("/historical-btc-price")
          .returns(HistoricalBtcPriceFixture);

        invokeStub.withArgs("/save-config").as("SaveConfig");

        win.ipcRenderer = {
          invoke: invokeStub,
        };
      },
    });

    cy.get("input").eq(1).type("testtest");
    cy.get("button").contains("Unlock").click();
    cy.contains("Incorrect Password").should("be.visible");
  });

  it("logs the user in with the correct password", () => {
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
        const invokeStub = cy.stub();

        invokeStub.withArgs("/get-config").returns({
          file:
            "U2FsdGVkX18uxfd3y9sExPgblt7b7DiVazdfH1jHsnLpgGHUhc+5HvMmjCD/1MVmOooNT3gySiyBYSl38Kn+Yed5loplPFrjlicwi/NLIYKvckSfZWsNVaimISfuMca+3aVQT/vJSrBHGZMvPUpLSM59Kd491MXVU6gAIVHkL7EcZWCgAwsMI9MTFnJC2l6hdFZAiMvV223ijqNriYAOgqSsdF7c6N9Q1GazxwHAUFpLXx2/5vX/n1Wsjjd2Zs0Ny+h6Iip4nCQGnBW83OTUuA==",
          modifiedTime: 12345,
        });

        invokeStub.withArgs("/getNodeConfig").returns({
          blocks: 687000,
          initialblockdownload: false,
          provider: "Blockstream",
          connected: true,
        });
        invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
        invokeStub
          .withArgs("/historical-btc-price")
          .returns(HistoricalBtcPriceFixture);

        invokeStub.withArgs("/save-config").as("SaveConfig");

        win.ipcRenderer = {
          invoke: invokeStub,
        };
      },
    });

    cy.get("input").eq(1).type("testtest");
    cy.get("button").contains("Unlock").click();
    cy.contains("Unlocking").should("be.visible");
    cy.contains("Current Price").should("be.visible");
    cy.get("@SaveConfig").should("have.been.calledOnce");
  });
});
