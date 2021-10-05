/* global cy */

import { Mnemonic, Multisig } from "../../../src/__tests__/fixtures";
import { truncateAddress } from "../../../src/utils/send";
describe("Send - General", () => {
  beforeEach(() => {
    cy.login();
  });
  it("sends a transaction", () => {
    cy.intercept("POST", "https://blockstream.info/api/tx", (req) => {
      req.reply("abc123");
    });

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

      win.ipcRenderer.invoke
        .withArgs("/sign")
        .onFirstCall() // 9130C3D6
        .returns({
          psbt: "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AtNDAAAAAAAAFgAUp2dcS0+/hi7LgyO6yFoeqwnbLMZFJpsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgICRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiuhHMEQCICE8CH/F7s5FnOf83xj+yJex/aOyy2dolfC+1cDnWGCZAiA0AZZcDlhEoWIvAAfOiDFEs5dWAX21WDqSgTEzJfDwiQEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA",
        })
        .onSecondCall() // 34ECF56B
        .returns({
          psbt: "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AtNDAAAAAAAAFgAUp2dcS0+/hi7LgyO6yFoeqwnbLMZFJpsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgICRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiuhHMEQCICE8CH/F7s5FnOf83xj+yJex/aOyy2dolfC+1cDnWGCZAiA0AZZcDlhEoWIvAAfOiDFEs5dWAX21WDqSgTEzJfDwiQEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgSpgH4HVOlS8WtVWZ5n+p1hSVxHl5S4vIQIW+O0725o4CIHJUEohJwX9MdDWS0V5y2OUa50FyT2msq4GdeTOk01/fAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=",
        })
        .as("sign response");
    });

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(
      "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx"
    );

    cy.get("#bitcoin-amount").type("0.001");

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction summary").should("be.visible");

    cy.contains("Confirm on Devices (0/2)").should("be.visible");

    cy.contains("9130C3D6").click();

    cy.contains("Confirm on Devices (1/2)").should("be.visible");

    cy.contains("34ECF56B").click();

    cy.contains("Broadcast Transaction").should("be.visible");

    cy.contains("Broadcast Transaction").click();

    cy.contains("Transaction Success").should("be.visible");

    cy.get("a").contains("View Transaction").should("be.visible");
  });

  it("shows correct tx details in Transaction Details Modal", () => {
    const SendAmount = "0.001";
    const SendAddress = "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx";

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(SendAddress);

    cy.get("#bitcoin-amount").type(SendAmount);

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction summary").should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("View transaction details").click();

    cy.contains("Transaction Details").should("be.visible");
    cy.get("[data-cy=transaction-outputs]")
      .contains(SendAddress)
      .should("be.visible");
    cy.get("[data-cy=transaction-outputs]")
      .contains(Multisig.unusedChangeAddresses[0].address)
      .should("be.visible");
  });

  it("allows transaction to be edited", () => {
    const sendAmount = "0.001";
    const sendAddress = "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx";

    const replacementSendAmount = "0.0025";
    const replacementSendAddress = "3Cid3dAuS9e8pTaNCydgwERv2wut4VQXSQ";

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(sendAddress);

    cy.get("#bitcoin-amount").type(sendAmount);

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction summary").should("be.visible");

    cy.contains(sendAmount).should("be.visible");
    cy.contains(truncateAddress(sendAddress)).should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Edit transaction").click();

    cy.get("#bitcoin-receipt").clear().type(replacementSendAddress);

    cy.get("#bitcoin-amount").clear().type(replacementSendAmount);

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction summary").should("be.visible");

    cy.contains(replacementSendAddress).should("be.visible");
    cy.contains(replacementSendAmount).should("be.visible");
  });

  it("automatically signs Mnemonic transactions", () => {
    const sendAmount = "0.001";
    const sendAddress = "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx";

    cy.contains("Send").click();

    cy.get("nav").contains(Mnemonic.config.name).click();

    cy.get("#bitcoin-receipt").type(sendAddress);

    cy.get("#bitcoin-amount").type(sendAmount);

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction summary").should("be.visible");

    cy.contains(sendAmount).should("be.visible");
    cy.contains(truncateAddress(sendAddress)).should("be.visible");
    cy.contains("Broadcast Transaction").should("be.visible");
  });
});
