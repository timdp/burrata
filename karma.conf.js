
module.exports = config => {
  const {
    CI,
    CIRCLE_TEST_REPORTS: outputDir
  } = process.env
  const settings = {
    frameworks: [
      'mocha',
      'mocha-iframes',
      'dirty-chai'
    ],
    browsers: [
      config.singleRun ? 'ChromeHeadless' : 'Chrome'
    ],
    reporters: [
      'spec',
      'coverage'
    ],
    files: [
      {
        pattern: 'src/**',
        included: false
      },
      {
        pattern: 'test/fixtures/**',
        included: false
      },
      {
        pattern: 'test/lib/setup.js',
        watched: false
      },
      {
        pattern: 'test/**/*.spec.js',
        watched: false
      }
    ],
    preprocessors: {
      'src/**': ['webpack', 'coverage'],
      'test/**/*.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /\bnode_modules\b/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env'
                ],
                plugins: [
                  '@babel/plugin-transform-runtime'
                ]
              }
            }
          }
        ]
      }
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    }
  }
  if (CI) {
    settings.coverageReporter.type = 'lcov'
    settings.reporters.push('coveralls')
  }
  if (outputDir != null) {
    settings.reporters.unshift('junit')
    settings.junitReporter = {
      outputDir
    }
  }
  config.set(settings)
}
