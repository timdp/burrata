import loadPlugins from 'rollup-load-plugins'
import { main, name } from './package.json'

const $ = loadPlugins()

export default {
  input: main,
  plugins: [
    $.nodeResolve({
      browser: true
    }),
    $.commonjs(),
    $.babel({
      presets: [
        ['@babel/preset-env', { modules: false }]
      ]
    })
  ],
  output: {
    file: `dist/${name}.js`,
    name,
    format: 'iife'
  }
}
