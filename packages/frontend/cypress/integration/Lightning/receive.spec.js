import { Lightning } from "../../../src/__tests__/fixtures";
import { getNewInvoice } from "../../support/getNewInvoice";

describe("Receive", () => {
  beforeEach(() => {
    cy.login();
  });
  it("displays a receive invoice", () => {
    const INVOICE_AMOUNT = 2500;
    const newInvoice = getNewInvoice(INVOICE_AMOUNT, 60);

    cy.window().then((win) => {
      win.ipcRenderer.invoke
        .withArgs("/lightning-invoice")
        .returns({
          paymentRequest: newInvoice.paymentRequest,
        })
        .as("/lightning-invoice");
    });

    cy.contains("Receive").click();
    cy.get("nav").contains(Lightning.config.name).click();

    cy.get("#lightning-memo").type("Testing lily wallet");

    cy.get("#lightning-amount").type(INVOICE_AMOUNT);

    cy.contains("Generate invoice").click();
  });
});
