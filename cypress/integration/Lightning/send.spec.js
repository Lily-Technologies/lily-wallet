/* global cy */

import { Multisig, Lightning } from "../../../src/__tests__/fixtures";
import { getNewInvoice } from "../../support/getNewInvoice";
describe("Send - Lightning", () => {
  beforeEach(() => {
    cy.login();
  });
  it("sends a transaction", () => {
    cy.intercept("POST", "https://blockstream.info/api/tx", (req) => {
      req.reply("abc123");
    });

    const paymentRequest = getNewInvoice(25000).paymentRequest;

    cy.window()
      .then((win) => {
        win.ipcRenderer.on.withArgs("/lightning-send-payment").returns({
          status: 2,
        });
      })
      .as("/lightning-send-payment");

    cy.window()
      .then((win) => {
        win.ipcRenderer.on
          .withArgs("/lightning-send-payment")
          .callsFake((args, args1) => {
            // setTimeout so that initialAccountMap can get set
            // this mimicks a delay for constructing the accountMap
            setTimeout(() => {
              const response = {
                status: 2,
                paymentRequest: paymentRequest,
                valueSats: paymentRequest.amount,
              };
              args1(undefined, response);
            }, 1);
          });
      })
      .as("/lightning-send-payment");

    cy.contains("Send").click();

    cy.get("nav").contains(Lightning.config.name).click();

    cy.get("#lightning-invoice").type(paymentRequest);

    cy.contains("Preview transaction").click();

    cy.contains("Payment summary").should("be.visible");

    cy.contains("Send payment").click();

    cy.contains("Payment success").should("be.visible");
  });
});
