const path = require('path')
const babelRule = require('./webpack.babel')
const { name: NAME } = require('./package.json')

const ENTRY = './src/index.js'
const DIST = path.resolve(__dirname, 'dist')
const CONFIGS = [
  {
    mode: 'development',
    filename: 'burrata.js'
  },
  {
    mode: 'production',
    filename: 'burrata.min.js'
  }
]

module.exports = CONFIGS.map(({ mode, filename }) => ({
  mode,
  entry: ENTRY,
  output: {
    library: NAME,
    libraryTarget: 'umd',
    filename,
    path: DIST
  },
  module: {
    rules: [
      babelRule
    ]
  }
}))
