(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxFetch = nx.Fetch || require('@jswork/next-fetch');
  var nodeFetch = require('node-fetch');
  var defaults = { fetch: nodeFetch, external: { baseUrl: null, username: null, password: null } };
  var STD_UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';

  require('@afeiship/next-jwt-authorization');

  var NxRailsApiSchema = nx.declare('nx.RailsApiSchema', {
    extends: NxFetch,
    methods: {
      init: function (inOptions) {
        var options = nx.mix(null, defaults, inOptions);
        this.base(options);
        this.external = this.options.external;
        this.token = null;
      },
      auth: function () {
        var { baseUrl, username, password } = this.external;
        var url = `${baseUrl}/rails_jwt_admin/authentication`;
        if (this.token) return Promise.resolve(this.token);
        return new Promise(function (resolve, reject) {
          nx.JwtAuthorization.auth(url, { username, password })
            .then((res) => resolve((this.token = res.token)))
            .catch(reject);
        });
      },
      request: function (inMethod, inUrl, inData, inOptions) {
        // skill: 这里不能用 this.base, 因为在 method 里面，又包了一层会导致 method.caller 变成 then里的匿名函数
        var self = this;
        var parent = this.$base;
        return this.auth().then(function (token) {
          inOptions.headers = { Authorization: token, 'User-Agent': STD_UA };
          return parent.request.call(self, inMethod, inUrl, inData, inOptions);
        });
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxRailsApiSchema;
  }
})();
