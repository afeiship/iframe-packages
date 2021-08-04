const NxRailsApiSchema = require('../src');

// const data = { key: 1, value: 2 };
// expect(!!data).toBe(true);
var schema = new NxRailsApiSchema({
  external: {
    baseUrl: 'https://www.fasimi.com',
    username: 'admin',
    password: '123123'
  }
});

schema.get('https://www.fasimi.com/admin/celebrities').then((res) => {
  console.log(res);
});
