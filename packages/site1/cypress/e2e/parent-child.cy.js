describe('empty spec', () => {
  it('open page should be ok', () => {
    cy.visit('http://s1.dev.com:5001');
    cy.get('title').invoke('text').should('eq', 'Site1');
  });

  it('parent call child: update random/fixed value', () => {
    cy.visit('http://s1.dev.com:5001');
    // wait ifram loaded
    cy.wait(1000);
    // update Random value -> Random
    cy.get('header > :nth-child(1)').click();

    // get element in iframe contentWindow
    cy.get('iframe').then(($iframe) => {
      const doc = $iframe[0].contentWindow.document;
      const btnRandom = doc.querySelector('button:nth-child(3)');
      expect(btnRandom.innerHTML).to.includes('from parent');
    });

    // update Random value -> fixed
    cy.get('header > :nth-child(2)').click();
    cy.get('iframe').then(($iframe) => {
      const doc = $iframe[0].contentWindow.document;
      const btnRandom = doc.querySelector('button:nth-child(3)');
      console.log('btnRandom html: ', btnRandom.innerHTML);
      expect(btnRandom.innerHTML).to.includes('from parent');
      expect(btnRandom.innerHTML).to.includes('FIXED_VALUE');
    });
  });

  it('update ifm: tabKey and persist', () => {
    cy.visit('http://s1.dev.com:5001');
    // tabKey IFM button
    cy.get('header > :nth-child(3)').click();

    // get current url by cypress
    cy.url().should('include', 'ifm=');

    // reload page -- check persist
    cy.reload();
    cy.wait(1000);
    cy.get('iframe').then(($iframe) => {
      const doc = $iframe[0].contentWindow.document;
      const btn = doc.querySelector('button:nth-child(4)');
      console.log('p2c btn:', btn);
      // expect(btn.innerHTML).to.includes('k2');
    });
  });
});
