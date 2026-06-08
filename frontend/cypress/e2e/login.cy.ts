describe("Login", () => {
  it("CP-01 Login válido", () => {
    cy.visit("/login");

    cy.get('[data-testid="login-email"]')
      .type("katerdz@icloud.com");

    cy.get('[data-testid="login-password"]')
      .type("ultimaK1");

    cy.get('[data-testid="login-submit"]')
      .click();

    cy.url().should("not.include", "/login");
  });
});