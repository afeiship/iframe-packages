(function () {
  const NxRailsApiSchema = require('../src');

  jest.setTimeout(50 * 1000);

  describe('NxRailsApiSchema.methods', function () {
    test('init', function (done) {
      // const data = { key: 1, value: 2 };
      // expect(!!data).toBe(true);
      var schema = new NxRailsApiSchema();
    });
  });
})();
