const path = require('path')
const { babel: BABEL_OPTS } = require('./package.json')

const ES_PACKAGES = [
  'p-defer'
]

const babelRule = {
  test: /\.js$/,
  include: [
    path.join(__dirname, 'src'),
    ...(ES_PACKAGES.map(name => path.join(__dirname, 'node_modules', name)))
  ],
  exclude: [],
  use: {
    loader: 'babel-loader',
    options: BABEL_OPTS
  }
}

module.exports = babelRule
