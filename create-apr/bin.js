#!/usr/bin/env node

const { spawnSync } = require('child_process')
const argv = require('yargs-parser')(process.argv.slice(2))
const { join } = require('path')
const debug = require('debug')
const which = require('which')
let hygen = ''
try {
  hygen = which.sync('hygen')
} catch (e) {
  hygen = join(__dirname, './node_modules/.bin/hygen')
}
const log = debug('apr:create')
log('argv', argv._)
process.env.HYGEN_TMPLS = join(__dirname, './template/_templates/')
spawnSync(hygen, ['apr-init', 'new', '--name', argv.dev ? 'playground' : argv.name || 'my-app'], { stdio: 'inherit' })

if (argv.dev) {
  // console.log('installing projects')
  // const aprCliPath = 'file:' + join(__dirname, '../', 'apr-cli')
  // process.cwd(aprCliPath)
  // const aprPath = 'file:' + join(__dirname, '../', 'action-packed-react')
  // process.cwd(aprPath)
  // log(aprCliPath)
  // log(aprPath)
  const currentPath = process.cwd()
  process.cwd('../')
  spawnSync('yarn', [], { stdio: 'inherit' })
  process.chdir(join(__dirname, '../apr-cli/'))
  spawnSync('npm', ['link'], { stdio: 'inherit' })
  process.cwd(currentPath)
  // spawnSync('yarn', ['add', aprCliPath, aprPath], { stdio: 'inherit' })
  spawnSync('yarn', ['link', 'apr-cli'], { stdio: 'inherit' })
} else {
  spawnSync('yarn', [], { stdio: 'inherit' })
  // spawnSync('yarn', ['add', 'apr-cli'], { stdio: 'inherit' })
  // spawnSync('yarn', ['add', 'action-packed-react'], {
  // stdio: 'inherit'
  // })
}
