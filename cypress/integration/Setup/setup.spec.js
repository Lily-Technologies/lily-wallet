/* global cy */

describe("Setup", () => {
  describe("General", () => {
    it("displays no devices detected when enumerate returns an empty array", () => {
      const ACCOUNT_NAME = "No devices";

      cy.login();

      cy.window().then((win) => {
        win.ipcRenderer.invoke
          .withArgs("/enumerate")
          .returns([])
          .as("Enumerate");
      });

      cy.contains("Add a new account").click();

      cy.contains("Hardware Wallet").click();

      cy.get("input").type(ACCOUNT_NAME);

      cy.contains("Continue").click();

      cy.contains("No devices detected").should("be.visible");
    });
  });
});
