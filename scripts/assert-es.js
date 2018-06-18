#!/usr/bin/env node

const { parse } = require('acorn')
const yargs = require('yargs')
const fs = require('fs')

const { _: filenames, v: ecmaVersion } = yargs
  .option('v', {
    type: 'number',
    default: 5
  })
  .strict()
  .parse()

let failures = 0

for (const filename of filenames) {
  let code = null
  try {
    code = fs.readFileSync(filename, 'utf8')
  } catch (err) {
    console.error(`Failed to read ${filename}: ${err}`)
    ++failures
    continue
  }
  try {
    parse(code, { ecmaVersion })
  } catch (err) {
    ++failures
    console.error(
      `Failed to parse ${filename} as ECMAScript ${ecmaVersion}: ${err}`
    )
  }
}

process.exit(failures)
