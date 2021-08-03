(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var nodeHttpSchema = require('node-http-schema').default;
  var defaults = { context: global };

  var NxRailsApiSchema = nx.declare('nx.RailsApiSchema', {
    statics: {
      create: function (inConfig, inOptions) {
        return nodeHttpSchema(inConfig, inOptions);
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxRailsApiSchema;
  }
})();
