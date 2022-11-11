
function waitmap() {
  // cy.wait('@sprites').then((interception) => {
  //  cy.log(interception.request.url)
  //})


  //cy.wait('@stdvis').then((interception) => {
  // cy.log(interception.request.url)
  //})

  cy.wait('@map').then((interception) => {
    cy.log(interception.request.url)
  })
}

function screenshot( screenname: string) {

  const name =  screenname
  if (Cypress.config('isInteractive')) {
    cy.screenshot(name)
  } else {
    cy.screenshot(name)
    cy.compareSnapshot(name);
  }
}

describe('has demo functionality', () => {
  beforeEach(() => {
    cy.viewport(1024, 768)
    cy.log('setup routes')
    cy.intercept({ method: 'GET', url: '**sprites.json' }).as('sprites');
    cy.intercept({ method: 'GET', url: '**standaard**' }).as('stdvis');
    cy.intercept({ method: 'GET', url: '**.pbf' }).as('map');

    cy.visit('http://localhost:4200/')
    cy.wait('@sprites')
    waitmap()
    screenshot("inital view");

    cy.contains('Demo Menu').click()
    waitmap()
  })

  it('shows standaard visualisatie after reset demo', () => {
    cy.contains('Reset').click()
    cy.get('.locationbox > :nth-child(2)').should('contain', 'Krankeledenstraat 30')
    waitmap()
    screenshot("standaard visualisatie after reset");
  })

  it('download image', () => {
   
    waitmap()
    cy.contains('download').click()
    const downloadfile = Cypress.config("downloadsFolder")+ '//map.png';
    cy.log (downloadfile)
    cy.readFile(downloadfile).should("exist");
    screenshot("same as downloaded image");

  })

  it('Willekeurige lokatie', () => {
   
    waitmap()
    cy.contains('Willekeurige locatie').click()
    //cy.wait(1000)
    cy.get('.locationbox > :nth-child(2)').then(($loc) => {
      cy.log($loc.text())
      expect($loc.text()).to.not.equal('Krankeledenstraat 30')
    })

  })
})
