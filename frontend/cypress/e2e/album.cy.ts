describe("Álbum", () => {
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

  it("CP-08 Abrir sobre disponible", () => {
    cy.visit("/album");

    cy.get('[data-testid^="pack-"]', {
      timeout: 10000,
    })
      .first()
      .click();

    cy.get('[data-testid="opening-pack"]', {
      timeout: 10000,
    }).should("exist");
  });
});