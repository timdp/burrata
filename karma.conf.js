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
      '{src,test}/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /\bnode_modules\b/,
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
