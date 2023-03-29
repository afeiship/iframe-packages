describe('empty spec', () => {
  it('only child: feature as normal', () => {
    cy.visit('http://s1.dev.com:5002');

    cy.get('button:nth-child(1)').click();
    cy.get('button:nth-child(2)').click();
    cy.get('button:nth-child(3)').click();

    cy.get('button:nth-child(3)').should('contain.text', '0.');
  });
});
