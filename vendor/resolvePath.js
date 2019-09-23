const webpack = require('webpack');

function resolvePath(config, env, paths = []) {
  config.resolve.modules = (config.resolve.modules || []).concat(paths);
  return config;
}

module.exports = resolvePath;
