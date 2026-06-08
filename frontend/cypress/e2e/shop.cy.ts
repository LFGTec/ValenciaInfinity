describe("Tienda", () => {
  beforeEach(() => {
    cy.visit("/login");

    cy.get('[data-testid="login-email"]')
      .type("katerdz@icloud.com");

    cy.get('[data-testid="login-password"]')
      .type("ultimaK1");

    cy.get('[data-testid="login-submit"]')
      .click();

    cy.url({ timeout: 15000 })
      .should("not.include", "/login");
  });

  it("CP-07 Comprar sobre de cartas", () => {
    cy.visit("/store");

    cy.get('[data-testid="buy-pack-button"]', {
      timeout: 10000,
    }).click();

    cy.contains("comprado con éxito", {
      timeout: 10000,
    }).should("be.visible");
  });
});