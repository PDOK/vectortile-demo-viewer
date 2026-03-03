
describe('PDOK VectorTile Demo Viewer - Visualisaties worden getoond', () => {

  const url = 'localhost:4200';

  beforeEach(() => {
    cy.visit(url);

    // Wacht tot de map zichtbaar is
    //cy.get('#map', { timeout: 10000 }).should('be.visible');
  });

  it('Controleert of de lijst met visualisaties zichtbaar is', () => {
    // UI heeft een menu-knop (hamburger) → openen indien nodig
    cy.get('body').then(($body) => {
      if ($body.find('.mdc-top-app-bar__navigation-icon').length > 0) {
        cy.get('.mdc-top-app-bar__navigation-icon').click();
      }
    });

    // Controleer of de layers-lijst geladen is
    cy.get('.mdc-list', { timeout: 10000 })
      .should('exist')
      .and('be.visible');
  });

  it('Controleert of alle visualisaties in de lijst bestaan en getoond worden', () => {

    // Open het menu als het niet al open is
    cy.get('body').then(($body) => {
      if ($body.find('.mdc-top-app-bar__navigation-icon').length > 0) {
        cy.get('.mdc-top-app-bar__navigation-icon').click();
      }
    });

    // Haal alle visualisatie-items op
    cy.get('.mdc-list .mdc-list-item').then(($items) => {
      const count = $items.length;

      cy.log(`Aantal gevonden visualisaties: ${count}`);
      expect(count).to.be.greaterThan(0);

      // Loop door alle items
      cy.wrap($items).each(($el, index) => {
        const naam = $el.text().trim();
        cy.log(`Controleer visualisatie: ${naam}`);

        // Check dat de tekst zichtbaar is
        cy.wrap($el).should('be.visible');

        // Check dat er een checkbox of toggle aanwezig is
        cy.wrap($el)
          .find('input[type="checkbox"], .mdc-switch')
          .should('exist');
      });
    });
  });

});

it('checkall', function() {});
it('check menu', function() {});

it('test menu', function() {});
