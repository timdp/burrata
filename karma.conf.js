const yargs = require('yargs')
const path = require('path')

const { mode } = yargs
  .string('mode').default('mode', 'spec')
  .parse()

module.exports = config => {
  const { CIRCLE_TEST_REPORTS } = process.env
  const ci = (CIRCLE_TEST_REPORTS != null)
  config.set({
    singleRun: true,
    frameworks: [
      'mocha',
      'dirty-chai'
    ],
    browsers: [
      'ChromeHeadless',
      ...(mode === 'spec' ? ['FirefoxHeadless'] : [])
    ],
    reporters: [
      ...(ci ? ['junit'] : []),
      ...(mode === 'spec' ? ['spec'] : []),
      ...(mode !== 'benchmark' ? ['coverage-istanbul'] : [])
    ],
    files: [
      { pattern: 'test/fixtures/**', included: false },
      (mode === 'benchmark') ? 'test/benchmark.js' : 'test/index.js'
    ],
    preprocessors: {
      '{src,test}/**/*.js': [
        'webpack',
        'sourcemap'
      ]
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            use: {
              loader: 'babel-loader'
            }
          },
          ...(mode !== 'benchmark' ? [{
            test: /\.js$/,
            include: [
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'test/fixtures')
            ],
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            enforce: 'post'
          }] : [])
        ]
      }
    },
    junitReporter: {
      outputDir: CIRCLE_TEST_REPORTS
    },
    coverageIstanbulReporter: {
      dir: 'coverage',
      reports: [
        'text',
        ...(mode === 'cover' ? ['lcov'] : [])
      ],
      fixWebpackSourcePaths: true
    }
  })
}
