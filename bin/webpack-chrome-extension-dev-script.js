#!/usr/bin/env node
const build = require('../scripts/build')
const dev = require('../scripts/dev')
const webpackConfig = require('../src/config/webpackConfig')()

function run(argv) {
  let order = argv[0]
  if (!order) {
    order = 'build'
  }
  if (order === 'build') {
    build(webpackConfig)
  } else if (order === 'dev') {
    dev(webpackConfig)
  } else {
    throw new Error(`unknown order '${order}', expected 'build' or 'dev'`)
  }
}

run(process.argv.slice(2))
