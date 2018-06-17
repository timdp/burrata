window.expect = window.chai.expect

const tests = require.context('.', true, /\.spec\.js$/)
tests.keys().forEach(tests)
const srcs = require.context('../src', true, /\.js$/)
srcs.keys().forEach(srcs)
