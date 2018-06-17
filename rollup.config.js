import loadPlugins from 'rollup-load-plugins'
import { main, name } from './package.json'

const PLUGINS = loadPlugins()
const ES_PACKAGES = [
  'p-defer',
  'event-target-shim'
]

export default {
  input: main,
  plugins: [
    PLUGINS.nodeResolve({
      browser: true
    }),
    PLUGINS.commonjs(),
    PLUGINS.babel({
      include: [
        'src/**',
        `node_modules/{${ES_PACKAGES.join(',')}}/**`
      ],
      presets: [
        ['@babel/preset-env', { modules: false }]
      ],
      plugins: [
        '@babel/plugin-transform-runtime'
      ],
      runtimeHelpers: true
    })
  ],
  output: {
    file: `dist/${name}.js`,
    name,
    format: 'iife'
  }
}
