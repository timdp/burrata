const { CIRCLE_TEST_REPORTS } = process.env

module.exports = config => {
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
  if (CIRCLE_TEST_REPORTS) {
    settings.coverageReporter.type = 'lcov'
    settings.reporters.unshift('junit')
    settings.reporters.push('coveralls')
    settings.junitReporter = {
      outputDir: CIRCLE_TEST_REPORTS
    }
  }
  config.set(settings)
}
