/* global cy */
import { Multisig } from "../../../src/__tests__/fixtures";
describe("Purchase", () => {
  it("goes through the buy a license flow", () => {
    cy.intercept("GET", "**/get-payment-address", (req) => {
      req.reply({
        address: "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx",
        basicThree: 0.00017363418094421467,
        childPath: "m/0/10",
        basicFive: 0.008681709047210735,
        premium: 0.008681709047210735,
      });
    }).as("getPaymentAddress");

    cy.intercept("POST", "**/get-license", (req) => {
      req.reply({
        signature:
          "J9bSCwnyPbh7BoO8Y7H7aTXy6rGTVRl+rYZ4tXnWWXOVUDlvKEuqUDIJmqHtZjjEEieycz4h2Kdl2iM2rR7PwIE=",
        license:
          "basic:735005:bedcce687c7a21d4c2c33c20f5a8e53303fc155f077550b46bf4e68eb2e2b255",
      });
    }).as("sendUnsignedTx");

    cy.intercept("POST", "https://blockstream.info/api/tx", (req) => {
      req.reply("abc123");
    });

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

    cy.wait(2500);
    cy.screenshot("home");
    cy.get("button").contains("Buy a License").click();

    cy.wait(1);
    cy.screenshot("license");
    cy.get("button:visible").contains("Buy Basic").click();

    cy.contains("Transaction Summary").should("be.visible");

    cy.contains("Confirm on Devices (0/2)").should("be.visible");

    cy.contains("9130C3D6").click();

    cy.contains("Confirm on Devices (1/2)").should("be.visible");

    cy.contains("34ECF56B").click();

    cy.contains("Broadcast Transaction").should("be.visible");

    cy.screenshot("approve");

    cy.contains("Broadcast Transaction").click();

    cy.contains("Payment Success").should("be.visible");
    cy.screenshot("success");
  });
});
