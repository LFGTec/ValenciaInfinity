describe("Amigos", () => {
  beforeEach(() => {
    cy.visit("/login");

    cy.get('[data-testid="login-email"]')
      .type("katerdz@icloud.com");

    cy.get('[data-testid="login-password"]')
      .type("ultimaK1");

    cy.get('[data-testid="login-submit"]')
      .should("not.be.disabled")
      .click();

    // Esperar a que salga del login
    cy.url({ timeout: 15000 })
      .should("not.include", "/login");

    // Esperar a que cargue la app
    cy.get("body", { timeout: 15000 })
      .should("be.visible");
  });

  it("CP-02 Buscar amigo", () => {
    cy.visit("/friends");
    
    cy.contains("BUSCAR USUARIOS")
    .click();

    cy.get('[data-testid="friend-search-input"]')
      .type("Juan");

    cy.contains("Juan");
  });

  it("CP-03 Agregar amigo", () => {
    cy.visit("/friends");
    
    cy.contains("BUSCAR USUARIOS")
    .click();

    cy.get('[data-testid="friend-search-input"]')
      .type("Angel García");

    cy.contains("AGREGAR AMIGO")
      .first()
      .click();

    cy.contains("SOLICITUD ENVIADA");
  });
});
