#!/usr/bin/env node

const { spawnSync } = require('child_process')
const argv = require('yargs-parser')(process.argv.slice(2))
const { join } = require('path')
const debug = require('debug')
var which = require('which')
var hygen = which.sync('hygen')
const log = debug('apr:create')
log('argv', argv._)
process.env.HYGEN_TMPLS = join(__dirname, './template/_templates/')
spawnSync(hygen, ['apr-init', 'new'], { stdio: 'inherit' })

if (argv.dev) {
  console.log('installing projects')
  const aprCliDir = 'file:' + join(__dirname, '../', 'apr-cli')
  const aprDir = 'file:' + join(__dirname, '../', 'action-packed-react')
  log(aprCliDir)
  log(aprDir)
  spawnSync('yarn', ['add', aprCliDir, aprDir], { stdio: 'inherit' })
  spawnSync('yarn', ['link', 'apr-cli'], { stdio: 'inherit' })
} else {
  spawnSync('yarn', ['add', 'apr-cli'], { stdio: 'inherit' })
  spawnSync('yarn', ['add', 'action-packed-react'], {
    stdio: 'inherit'
  })
}
