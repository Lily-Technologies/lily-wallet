/* global cy */
import { Multisig } from "../../../src/__tests__/fixtures";
describe("Support", () => {
  it("shows a valid support code when accessing support portal with purchased license", () => {
    cy.intercept("POST", "**/support", (req) => {
      req.reply({
        code: "abc12",
      });
    }).as("getSupportCode");

    cy.login();

    cy.get("button#options-menu").eq(1).click();
    cy.contains("Support").click();

    cy.contains("Lily Support Portal").should("be.visible");

    cy.get("[data-cy=support-code]").contains("a").should("be.visible");
    cy.get("[data-cy=support-code]").contains("b").should("be.visible");
    cy.get("[data-cy=support-code]").contains("c").should("be.visible");
    cy.get("[data-cy=support-code]").contains("1").should("be.visible");
    cy.get("[data-cy=support-code]").contains("2").should("be.visible");
  });

  it("doesnt show a support code when accessing support portal without a purchased license", () => {
    cy.intercept("POST", "**/support", (req) => {
      req.reply({
        statusCode: 401,
        body: "Invalid license",
      });
    }).as("getSupportCode");

    cy.login();

    cy.get("button#options-menu").eq(1).click();
    cy.contains("Support").click();

    cy.contains("Lily Support Portal").should("be.visible");

    cy.get("[data-cy=support-code]").contains("a").should("not.exist");
    cy.get("[data-cy=support-code]").contains("b").should("not.exist");
    cy.get("[data-cy=support-code]").contains("c").should("not.exist");
    cy.get("[data-cy=support-code]").contains("1").should("not.exist");
    cy.get("[data-cy=support-code]").contains("2").should("not.exist");
  });
});
