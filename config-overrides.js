const rewireDefinePlugin = require('./vendor/definePlugin');
const rewireResolvePath = require('./vendor/resolvePath');
const rewireHotLoader = require('./vendor/rewireHotLoader');

const path = require('path');

module.exports = {
  webpack: function(config, env) {
    config = rewireDefinePlugin(config, env, {
      'process.env.VERSION': JSON.stringify(require('./package.json').version),
      'process.env.__DEV__': env === 'development',
      'process.env.__PROD__': env === 'production',
    });

    config = rewireHotLoader(config, env);
    config = rewireResolvePath(config, env, [path.resolve('./src')]);

    return config;
  },
  jest: config => {
    config.moduleNameMapper = {
      '^comps/(.+)$': '<rootDir>/src/comps/$1',
      '^lib/(.+)$': '<rootDir>/src/lib/$1',
      '^images/(.+)$': '<rootDir>/src/images/$1',
      '^store/(.+)$': '<rootDir>/src/store/$1',
    };
    return config;
  },
};
