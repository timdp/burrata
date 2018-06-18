const path = require('path')
const {
  babel: BABEL_OPTS,
  dependencies
} = require('./package.json')

// Treat all dependencies as ES2015+ (e.g., p-defer and event-target-shim)
const ES_PACKAGES = Object.keys(dependencies)
  .filter(name => !name.startsWith('@babel/'))

const NODE_MODULES = path.join(__dirname, 'node_modules')

const PACKAGE_ALIASES = {
  'event-target-shim': // Main is .mjs but that breaks the build
    path.join(NODE_MODULES, 'event-target-shim/dist/event-target-shim.js')
}

const babelRule = {
  test: /\.m?js$/,
  include: [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'test'),
    ...(ES_PACKAGES.map(name => path.join(NODE_MODULES, name)))
  ],
  exclude: [],
  resolve: {
    alias: PACKAGE_ALIASES
  },
  use: {
    loader: 'babel-loader',
    options: BABEL_OPTS
  }
}

module.exports = babelRule
