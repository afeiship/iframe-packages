(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var nodeFetch = require('node-fetch');
  var defaults = { fetch: nodeFetch, external: { baseUrl: null, username: null, password: null } };
  var STD_UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';

  require('@afeiship/next-jwt-authorization');
  require('@jswork/next-fetch');

  var NxRailsApiSchema = nx.declare('nx.RailsApiSchema', {
    methods: {
      init: function (inOptions) {
        this.options = nx.mix(null, defaults, inOptions);
        this.external = this.options.external;
        this.token = null;
      },
      auth: function () {
        const { baseUrl, username, password } = this.external;
        const url = `${baseUrl}/rails_jwt_admin/authentication`;
        if (this.token) return Promise.resolve(this.token);
        return new Promise(function (resolve, reject) {
          nx.JwtAuthorization.auth(url, { username, password })
            .then((res) => resolve(res.token))
            .catch(reject);
        });
      },
      request: function (inMethod, inUrl, inData, inOptions) {
        var self = this;
        return self.auth().then(() => {
          inOptions.headers = { Authorization: self.token, 'User-Agent': STD_UA };
          return this.$base.request(inMethod, inUrl, inData, inOptions);
        });
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxRailsApiSchema;
  }
})();
