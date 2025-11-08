describe('Compra de Producto E2E', () => {
  beforeEach(() => {
    // Limpiar cookies y localStorage antes de cada test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('debe comprar "Remera de Los Redondos" exitosamente', () => {
    // 1. Visitar la página principal
    cy.visit('/');

    // 2. Logearse
    const botonLogin = cy.get(
      '.layout-container .header .rightmenu-container .login-container .login-button'
    );
    botonLogin.click();
    cy.url().should('include', '/login');

    cy.get('input[name="email"]').type('npiacentini@frba.utn.edu.ar');
    cy.get('input[name="password"]').type('Hola.1234');
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/login');

    // 3. Buscar el producto "Remera de Los Redondos" en el carousel
    cy.contains('Remera de Los Redondos', { timeout: 10000 }).should(
      'be.visible'
    );

    // 4. Click en "Ver Detalles" del producto (es un Link, no button)
    // Buscar el contenedor del producto y hacer click en "Ver Detalles"
    cy.contains('Remera de Los Redondos')
      .parents(
        '.carousel-item, .producto-card, [class*="carousel"], [class*="product"]'
      )
      .first()
      .contains('a', 'Ver Detalles')
      .click();

    // 5. Verificar que estamos en la página de detalles del producto
    cy.url().should('include', '/productos/');
    cy.contains('Remera de Los Redondos').should('be.visible');

    // 6. Click en "Comprar ahora"
    cy.contains('button', 'Comprar ahora').click();

    // 7. Verificar que estamos en el carrito
    cy.url().should('include', '/cart');
    cy.contains('Remera de Los Redondos').should('be.visible');

    // 8. Click en "Proceder al Pago"
    cy.contains('button', 'Proceder al Pago').click();

    // 9. Esperar a que aparezcan las direcciones guardadas
    cy.contains(/Direcciones guardadas|Dirección de entrega/i, {
      timeout: 5000,
    }).should('be.visible');

    // 10. Seleccionar la primera dirección guardada (hacer click en el botón)
    cy.get('.direccion-boton').first().click();

    // 11. Click en "Confirmar Compra"
    cy.contains('button', 'Confirmar Compra').click();
    
    // 12. Validar que aparece el toast de éxito
    cy.contains('¡Compra realizada con éxito! Gracias por tu compra', {
      timeout: 10000,
    }).should('be.visible');
  });
});
