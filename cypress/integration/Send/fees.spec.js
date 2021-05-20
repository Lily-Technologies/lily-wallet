import { Multisig } from "../../../src/__tests__/fixtures";
import BigNumber from "bignumber.js";
import { green200 } from "'../../../src/utils/colors";
import chaiColors from "chai-colors";

chai.use(chaiColors);

const getNumberFromString = (numberAsString) => {
  return new BigNumber(numberAsString.replaceAll(",", "")).toNumber();
};

describe("Send - Import transactions", () => {
  beforeEach(() => {
    cy.login();
  });
  it("can adjust fees for a transaction", () => {
    let currentBitcoinPrice;

    // grab the current price from main screen
    cy.contains("1BTC").then((el) => {
      const text = el.text();
      const priceAsString = text.substring(text.indexOf("$") + 1);
      currentBitcoinPrice = getNumberFromString(priceAsString);
    });

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(
      "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx"
    );

    cy.get("#bitcoin-amount").type("0.001");

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction Summary").should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.get("[data-cy=fastFeePrice]").then((el) => {
      cy.get("[data-cy=fastFeeBTC]").then((el2) => {
        const fastFeePrice = getNumberFromString(el.text());
        const btcNumber = getNumberFromString(el2.text());
        expect(
          new BigNumber(currentBitcoinPrice * btcNumber)
            .decimalPlaces(2)
            .toNumber()
        ).equal(fastFeePrice);
      });
    });

    cy.get("[data-cy=normalFeePrice]").then((el) => {
      cy.get("[data-cy=normalFeeBTC]").then((el2) => {
        const normalFeePrice = getNumberFromString(el.text());
        const btcNumber = getNumberFromString(el2.text());
        expect(
          new BigNumber(currentBitcoinPrice * btcNumber)
            .decimalPlaces(2)
            .toNumber()
        ).equal(normalFeePrice);
      });
    });

    let slowFeePrice;
    let slowBtcPrice;
    cy.get("[data-cy=slowFeePrice]").then((el) => {
      cy.get("[data-cy=slowFeeBTC]").then((el2) => {
        slowFeePrice = getNumberFromString(el.text());
        slowBtcPrice = getNumberFromString(el2.text());
        expect(
          new BigNumber(currentBitcoinPrice * slowBtcPrice)
            .decimalPlaces(2)
            .toNumber()
        ).equal(slowFeePrice);
      });
    });

    cy.contains("Slow").click();

    cy.get("[data-cy=transactionFeeBtc]").then((transactionFeeBtc) => {
      expect(getNumberFromString(transactionFeeBtc.text())).equal(slowBtcPrice);
    });

    cy.get("[data-cy=transactionFeeUsd]").then((transactionFeeUsd) => {
      expect(getNumberFromString(transactionFeeUsd.text())).equal(slowFeePrice);
    });

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.get("[data-cy=slowFeeItem]")
      .should("have.css", "background-color")
      .and("be.colored", green200);
  });

  it("can accurately static fee amounts and prices", () => {
    let currentBitcoinPrice;

    // grab the current price from main screen
    cy.contains("1BTC").then((el) => {
      const text = el.text();
      const priceAsString = text.substring(text.indexOf("$") + 1);
      currentBitcoinPrice = getNumberFromString(priceAsString);
    });

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(
      "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx"
    );

    cy.get("#bitcoin-amount").type("0.001");

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction Summary").should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.get("[data-cy=fastFeePrice]").then((el) => {
      cy.get("[data-cy=fastFeeBTC]").then((el2) => {
        const fastFeePrice = getNumberFromString(el.text());
        const btcNumber = getNumberFromString(el2.text());
        expect(
          new BigNumber(currentBitcoinPrice * btcNumber)
            .decimalPlaces(2)
            .toNumber()
        ).equal(fastFeePrice);
      });
    });

    cy.get("[data-cy=normalFeePrice]").then((el) => {
      cy.get("[data-cy=normalFeeBTC]").then((el2) => {
        const normalFeePrice = getNumberFromString(el.text());
        const btcNumber = getNumberFromString(el2.text());
        expect(
          new BigNumber(currentBitcoinPrice * btcNumber)
            .decimalPlaces(2)
            .toNumber()
        ).equal(normalFeePrice);
      });
    });

    let slowFeePrice;
    let slowBtcPrice;
    cy.get("[data-cy=slowFeePrice]").then((el) => {
      cy.get("[data-cy=slowFeeBTC]").then((el2) => {
        slowFeePrice = getNumberFromString(el.text());
        slowBtcPrice = getNumberFromString(el2.text());
        expect(
          new BigNumber(currentBitcoinPrice * slowBtcPrice)
            .decimalPlaces(2)
            .toNumber()
        ).equal(slowFeePrice);
      });
    });

    cy.contains("Slow").click();

    cy.get("[data-cy=transactionFeeBtc]").then((transactionFeeBtc) => {
      expect(getNumberFromString(transactionFeeBtc.text())).equal(slowBtcPrice);
    });

    cy.get("[data-cy=transactionFeeUsd]").then((transactionFeeUsd) => {
      expect(getNumberFromString(transactionFeeUsd.text())).equal(slowFeePrice);
    });
  });

  it("highlights correct fee level when fee level changed", () => {
    const CUSTOM_FEE = 0.0001;

    let currentBitcoinPrice;

    // grab the current price from main screen
    cy.contains("1BTC").then((el) => {
      const text = el.text();
      const priceAsString = text.substring(text.indexOf("$") + 1);
      currentBitcoinPrice = getNumberFromString(priceAsString);
    });

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(
      "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx"
    );

    cy.get("#bitcoin-amount").type("0.001");

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction Summary").should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.contains("Slow").click();

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.get("[data-cy=slowFeeItem]")
      .should("have.css", "background-color")
      .and("be.colored", green200);

    cy.contains("Set custom fee").click();

    cy.get("input#custom-fee").clear().type(CUSTOM_FEE);

    cy.contains("Adjust fee").click();

    cy.get("[data-cy=transactionFeeBtc]").then((transactionFeeBtc) => {
      expect(getNumberFromString(transactionFeeBtc.text())).equal(CUSTOM_FEE);
    });

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.get("[data-cy=customFeeItem]")
      .should("have.css", "background-color")
      .and("be.colored", green200);

    cy.contains("Fast").click();

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.get("[data-cy=fastFeeItem]")
      .should("have.css", "background-color")
      .and("be.colored", green200);
  });

  it("sets a custom fee", () => {
    const CUSTOM_FEE = 0.0001;

    let currentBitcoinPrice;

    // grab the current price from main screen
    cy.contains("1BTC").then((el) => {
      const text = el.text();
      const priceAsString = text.substring(text.indexOf("$") + 1);
      currentBitcoinPrice = getNumberFromString(priceAsString);
    });

    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("#bitcoin-receipt").type(
      "bc1q5an4cj60h7rzajurywavsks74vyaktxxp9m5cx"
    );

    cy.get("#bitcoin-amount").type("0.001");

    cy.contains("Preview Transaction").click();

    cy.contains("Transaction Summary").should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Adjust transaction fee").click();

    cy.contains("Set custom fee").click();

    cy.get("input#custom-fee").clear().type(CUSTOM_FEE);

    cy.contains("Adjust fee").click();

    cy.get("[data-cy=transactionFeeBtc]").then((transactionFeeBtc) => {
      expect(getNumberFromString(transactionFeeBtc.text())).equal(CUSTOM_FEE);
    });
  });
});
