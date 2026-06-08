describe("Racha Diaria", () => {
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

  it("CP-06 Estado de recompensa diaria", () => {
    cy.visit("/daily-rewards");

    cy.get("body").then(($body) => {

      // Caso 1: disponible para reclamar
      if ($body.text().includes("RECLAMAR")) {
        cy.contains("RECLAMAR").click();

        cy.contains("¡Recompensa reclamada!", {
          timeout: 10000,
        }).should("be.visible");
      }

      // Caso 2: ya fue reclamada
      else if ($body.text().includes("RECLAMADO")) {
        cy.contains("RECLAMADO")
          .should("be.visible");
      }

      // Caso 3: aún no disponible
      else {
        cy.contains("NO DISPONIBLE")
          .should("be.visible");
      }
    });
  });
});