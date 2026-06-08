describe("Gestión de Cartas", () => {

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

  it("CP-09 Crear carta", () => {

    cy.visit("/admin/cards");

    cy.get('[data-testid="add-card-button"]')
      .click();

    cy.get('[data-testid="card-name-input"]')
      .type("Carta Cypress");

    cy.get('[data-testid="card-type-select"]')
      .select("jugador");

    cy.get('[data-testid="card-season-input"]')
      .type("2026");

    cy.get('[data-testid^="rarity-"]')
      .first()
      .click();

    cy.get('[data-testid="save-card-button"]')
      .click();

    cy.contains("Carta creada")
      .should("be.visible");
  });

  it("CP-10 Buscar carta", () => {

    cy.visit("/admin/cards");

    cy.get('[data-testid="search-card-input"]')
        .type("Hugo");

    cy.contains("Hugo")
        .should("exist");
    });

});