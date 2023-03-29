describe('empty spec', () => {
  it('child-parent: trigger /about page then test back action', () => {
    cy.visit('http://s1.dev.com:5001');
    cy.wait(1000);
    cy.get('iframe').then(($iframe) => {
      const doc = $iframe[0].contentWindow.document;
      const btn1 = doc.querySelector('button:nth-child(1)');
      const btn2 = doc.querySelector('button:nth-child(2)');
      btn1.click();
      cy.url().should('include', '/about');
      cy.wait(100);
      btn2.click();
      cy.url().should('eq', 'http://s1.dev.com:5001/');
    });
  });
});
