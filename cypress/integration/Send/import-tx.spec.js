import { Multisig, Mnemonic } from "../../../src/__tests__/fixtures";

describe("Send - Import transactions", () => {
  beforeEach(() => {
    cy.login();

    cy.window().then((win) => {
      win.ipcRenderer.invoke.withArgs("/enumerate").returns([]);
    });
  });

  it("allows an unsigned transaction to be imported via a file", () => {
    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("[data-cy=send-form]").find("#options-menu").click();

    cy.contains("Import from file").click();

    cy.get("input[type=file]").then((el) => {
      const blob = Cypress.Blob.base64StringToBlob(
        btoa(Multisig.other.unsigned_transasction),
        "text/plain"
      );

      const file = new File([blob], "unsigned_tx.psbt", { type: "text/plain" });
      const list = new DataTransfer();
      list.items.add(file);
      const myFileList = list.files;

      el[0].files = myFileList;
      el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("0.01 BTC").should("be.visible");
    cy.contains("bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk").should(
      "be.visible"
    );
    cy.contains("No devices detected").should("be.visible");
  });

  it("allows a transaction with one signature to be imported via a file", () => {
    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("[data-cy=send-form]").find("#options-menu").click();

    cy.contains("Import from file").click();

    cy.get("input[type=file]").then((el) => {
      const blob = Cypress.Blob.base64StringToBlob(
        btoa(Multisig.other.one_signature_transaction),
        "text/plain"
      );

      const file = new File([blob], "unsigned_tx.psbt", { type: "text/plain" });
      const list = new DataTransfer();
      list.items.add(file);
      const myFileList = list.files;

      el[0].files = myFileList;
      el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("0.01 BTC").should("be.visible");
    cy.contains("bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk").should(
      "be.visible"
    );
    cy.contains(
      Multisig.config.extendedPublicKeys[1].device.fingerprint
    ).should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();
    cy.contains("Edit transaction").should("not.exist");
  });

  it("allows a transaction with two signatures to be imported via a file", () => {
    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("[data-cy=send-form]").find("#options-menu").click();

    cy.contains("Import from file").click();

    cy.get("input[type=file]").then((el) => {
      const blob = Cypress.Blob.base64StringToBlob(
        btoa(Multisig.other.two_signature_transaction),
        "text/plain"
      );

      const file = new File([blob], "unsigned_tx.psbt", { type: "text/plain" });
      const list = new DataTransfer();
      list.items.add(file);
      const myFileList = list.files;

      el[0].files = myFileList;
      el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("0.01 BTC").should("be.visible");
    cy.contains("bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk").should(
      "be.visible"
    );
    cy.contains(
      Multisig.config.extendedPublicKeys[0].device.fingerprint
    ).should("be.visible");

    cy.contains(
      Multisig.config.extendedPublicKeys[1].device.fingerprint
    ).should("be.visible");
    cy.get("[data-cy=send-options-dropdown]").click();
    cy.contains("Edit transaction").should("not.exist");
  });

  it("allows a transaction to be input via text", () => {
    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("[data-cy=send-form]").find("#options-menu").click();

    cy.contains("Import from clipboard").click();

    cy.get(".ReactModal__Content").within((modal) => {
      cy.get("textarea").type(Multisig.other.unsigned_transasction);
    });

    cy.contains("Import transaction").click();

    cy.contains("0.01 BTC").should("be.visible");
    cy.contains("bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk").should(
      "be.visible"
    );
    cy.contains("No devices detected").should("be.visible");

    cy.get("[data-cy=send-options-dropdown]").click();

    cy.contains("Edit transaction").should("be.visible");
  });

  it("shows an error if the user tries to import invalid transasction via a file", () => {
    cy.contains("Send").click();

    cy.get("nav").contains(Multisig.config.name).click();

    cy.get("[data-cy=send-form]").find("#options-menu").click();

    cy.contains("Import from file").click();

    cy.get("input[type=file]").then((el) => {
      const blob = Cypress.Blob.base64StringToBlob("foobar", "text/plain");

      const file = new File([blob], "foobar.psbt", { type: "text/plain" });
      const list = new DataTransfer();

      list.items.add(file);
      const myFileList = list.files;

      el[0].files = myFileList;
      el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("Invalid Transaction").should("be.visible");

    cy.contains("Dismiss").click();
  });

  it("shows an error if the user tries to import a transaction from the wrong account", () => {
    cy.contains("Send").click();

    cy.get("nav").contains(Mnemonic.config.name).click();

    cy.get("[data-cy=send-form]").find("#options-menu").click();

    cy.contains("Import from file").click();

    cy.get("input[type=file]").then((el) => {
      const blob = Cypress.Blob.base64StringToBlob(
        btoa(Multisig.other.two_signature_transaction),
        "text/plain"
      );

      const file = new File([blob], "foobar.psbt", { type: "text/plain" });
      const list = new DataTransfer();

      list.items.add(file);
      const myFileList = list.files;

      el[0].files = myFileList;
      el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("Error").should("be.visible");
  });
});
