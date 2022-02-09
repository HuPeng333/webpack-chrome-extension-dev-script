#!/usr/bin/env node
const build = require('../scripts/build')
const dev = require('../scripts/dev')

function run(argv) {
  let order = argv[0]
  console.log(order)
  if (!order) {
    order = 'build'
  }
  if (order === 'build') {
    build()
  } else if (order === 'dev') {
    dev()
  } else {
    throw new Error(`unknown order '${order}', expected 'build' or 'dev'`)
  }
}

run(process.argv.slice(2))
