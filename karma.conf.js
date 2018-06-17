module.exports = config => {
  const { CIRCLE_TEST_REPORTS } = process.env
  const ci = (CIRCLE_TEST_REPORTS != null)
  config.set({
    frameworks: [
      'mocha',
      'mocha-iframes',
      'dirty-chai'
    ],
    browsers: [
      'ChromeHeadless'
    ],
    reporters: [
      ...(ci ? ['junit', 'spec'] : ['progress']),
      'coverage',
      ...(ci ? ['coveralls'] : [])
    ],
    files: [
      { pattern: 'test/fixtures/**', included: false },
      'test/lib/setup.js',
      'test/**/*.spec.js'
    ],
    preprocessors: {
      '{src,test}/**/*.js': ['webpack']
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
                  '@babel/plugin-transform-runtime',
                  'istanbul'
                ]
              }
            }
          }
        ]
      }
    },
    junitReporter: {
      outputDir: CIRCLE_TEST_REPORTS
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text', subdir: '.' },
        ...(ci ? [{ type: 'lcov', subdir: '.' }] : [])
      ]
    }
  })
}
