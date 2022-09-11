describe('empty spec', () => {
  it('only parent: feature as normal', () => {
    cy.visit('http://s1.dev.com:5001');
    // remove ifram element
    cy.get('iframe').then(($iframe) => {
      $iframe.remove();
    });

    // test page no errors
    cy.get('button:nth-child(4)').click();
    cy.get('button:nth-child(1)').click();
    cy.get('button:nth-child(2)').click();
    cy.get('button:nth-child(3)').click();

    cy.get('button:nth-child(4)').should('contain.text', 'ONLY_VALUE');
    cy.get('h1').should('contain.text', 'Home page');
  });
});
