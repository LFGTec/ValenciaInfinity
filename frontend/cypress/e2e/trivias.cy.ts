describe("Trivias", () => {
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

  it("CP-04 Abrir trivia", () => {
    cy.visit("/trivias");

    cy.get('[data-testid^="start-trivia-"]')
    .first()
    .click();

    cy.contains("Pregunta");
  });

  it("CP-05 Completar trivia correctamente", () => {
    cy.visit("/trivias");

    // Iniciar trivia
    cy.get('[data-testid^="start-trivia-"]')
      .first()
      .click();

    // Seleccionar respuesta correcta (primera opción)
    cy.get('[data-testid="answer-option-0"]', {
      timeout: 10000,
    }).click();

    // Verificar resultado final
    cy.contains("QUIZ COMPLETADO", {
      timeout: 10000,
    }).should("be.visible");

    // Verificar que se muestran los puntos obtenidos
    cy.contains("PUNTOS")
      .should("be.visible");

    // Continuar
    cy.get('[data-testid="continue-after-quiz"]')
      .click();
  });

});