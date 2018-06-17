const path = require('path')

module.exports = config => {
  const { CIRCLE_TEST_REPORTS } = process.env
  const ci = (CIRCLE_TEST_REPORTS != null)
  config.set({
    frameworks: [
      'mocha',
      'dirty-chai'
    ],
    browsers: [
      config.singleRun ? 'ChromeHeadless' : 'Chrome'
    ],
    reporters: [
      ...(ci ? ['junit'] : []),
      'spec',
      'coverage-istanbul'
    ],
    files: [
      { pattern: 'test/fixtures/**', included: false },
      'test/index.js'
    ],
    preprocessors: {
      '{src,test}/**/*.js': ['webpack', 'sourcemap']
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
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    targets: {
                      chrome: 64
                    }
                  }]
                ],
                plugins: [
                  '@babel/plugin-transform-runtime'
                ]
              }
            }
          },
          {
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
          }
        ]
      }
    },
    junitReporter: {
      outputDir: CIRCLE_TEST_REPORTS
    },
    coverageIstanbulReporter: {
      dir: 'coverage',
      reports: ['text', 'lcov'],
      fixWebpackSourcePaths: true
    }
  })
}
