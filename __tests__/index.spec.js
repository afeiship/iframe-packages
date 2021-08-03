(function() {
  const NxRailsApiSchema = require('../src');

  describe('NxRailsApiSchema.methods', function() {
    test('init', function() {
      const data = { key: 1, value: 2 };
      expect(!!data).toBe(true);
    });
  });
})();
