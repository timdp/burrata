const path = require('path')
const babelRule = require('./webpack.babel')
const { name: NAME } = require('./package.json')

const ENTRY = './src/index.js'
const DIST = path.resolve(__dirname, 'dist')
const CONFIGS = [
  {
    minimize: false,
    filename: 'burrata.js'
  },
  {
    minimize: true,
    filename: 'burrata.min.js'
  }
]

module.exports = CONFIGS.map(({ minimize, filename }) => ({
  mode: 'production',
  entry: ENTRY,
  output: {
    library: NAME,
    libraryTarget: 'umd',
    filename,
    path: DIST
  },
  optimization: {
    minimize
  },
  module: {
    rules: [
      babelRule
    ]
  }
}))
