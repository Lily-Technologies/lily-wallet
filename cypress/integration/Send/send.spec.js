/* global cy */
import { networks } from "bitcoinjs-lib";
import HistoricalBtcPriceFixture from "../../fixtures/historical-btc-price.json";

import {
  MultisigAccount,
  MultisigAddresses,
  MultisigChangeAddresses,
  MultisigTransactions,
  MultisigUnusedAddresses,
  MultisigUnusedChangeAddresses,
  MultisigUTXOs,
} from "../../../src/__tests__/fixtures";

import { createConfig } from "../../support/createConfig";

describe("Receive", () => {
  it("displays a receive address", () => {
    cy.intercept("POST", "https://blockstream.info/api/tx", (req) => {
      req.reply("abc123");
    });

    const PASSWORD = "testtest";
    cy.visit("http://localhost:3001/login", {
      onBeforeLoad(win) {
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

        invokeStub
          .withArgs("/enumerate")
          .returns(
            MultisigAccount.config.extendedPublicKeys.map((xpub) => ({
              type: xpub.device.type,
              model: xpub.device.model,
              fingerprint: xpub.device.fingerprint,
              path: "/path/to/device",
              needs_pin_sent: false,
              needs_passphrase_sent: false,
            }))
          )
          .as("Enumerate");

        invokeStub
          .withArgs("/sign")
          .onFirstCall() // 9130C3D6
          .returns({
            psbt:
              "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AtNDAAAAAAAAFgAUp2dcS0+/hi7LgyO6yFoeqwnbLMZFJpsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgICRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiuhHMEQCICE8CH/F7s5FnOf83xj+yJex/aOyy2dolfC+1cDnWGCZAiA0AZZcDlhEoWIvAAfOiDFEs5dWAX21WDqSgTEzJfDwiQEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA",
          })
          .onSecondCall() // 34ECF56B
          .returns({
            psbt:
              "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AtNDAAAAAAAAFgAUp2dcS0+/hi7LgyO6yFoeqwnbLMZFJpsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgICRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiuhHMEQCICE8CH/F7s5FnOf83xj+yJex/aOyy2dolfC+1cDnWGCZAiA0AZZcDlhEoWIvAAfOiDFEs5dWAX21WDqSgTEzJfDwiQEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgSpgH4HVOlS8WtVWZ5n+p1hSVxHl5S4vIQIW+O0725o4CIHJUEohJwX9MdDWS0V5y2OUa50FyT2msq4GdeTOk01/fAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=",
          })
          .as("sign response");

        const onStub = cy.stub().callsFake((args, args1) => {
          // setTimeout so that initialAccountMap can get set
          // this mimicks a delay for constructing the accountMap
          setTimeout(() => {
            const multisigAccount = {
              name: MultisigAccount.name,
              config: MultisigAccount.config,
              addresses: MultisigAddresses.default,
              changeAddresses: MultisigChangeAddresses.default,
              availableUtxos: MultisigUTXOs.default,
              transactions: MultisigTransactions.default,
              unusedAddresses: MultisigUnusedAddresses.default,
              unusedChangeAddresses: MultisigUnusedChangeAddresses.default,
              currentBalance: 29595127,
              loading: false,
            };
            args1(undefined, multisigAccount);
          }, 500);
        });

        win.ipcRenderer = {
          invoke: invokeStub,
          on: onStub,
          send: sendStub,
        };
      },
    });

    cy.get("input").eq(1).type(PASSWORD);
    cy.get("button").contains("Unlock").click();

    cy.contains("Unlocking").should("be.visible");

    cy.wait(2500); // wait for unlocking timeout to end

    cy.contains("Current Price").should("be.visible");

    cy.contains("Send").click();

    cy.get("nav").contains(MultisigAccount.name).click();

    cy.get("#bitcoin-receipt").type(
      "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx"
    );
    cy.get("#bitcoin-amount").type("0.001");
    cy.contains("Preview Transaction").click();

    cy.contains("Transaction Summary").should("be.visible");

    cy.contains("Confirm on Devices (0/2)").should("be.visible");

    cy.contains("9130C3D6").click();

    cy.contains("Confirm on Devices (1/2)").should("be.visible");

    cy.contains("34ECF56B").click();

    cy.contains("Broadcast Transaction").should("be.visible");

    cy.contains("Broadcast Transaction").click();

    cy.contains("Transaction Success").should("be.visible");

    cy.get("a").contains("View Transaction").should("be.visible");
  });
});
