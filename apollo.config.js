module.exports = {
  client: {
    service: {
      name: 'citiesense',
      url: 'http://citiesense.dev/graphql',
      // optional headers
      headers: {},
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
    includes: ['./src/**/*.js'], // array of glob patterns
  },
};
