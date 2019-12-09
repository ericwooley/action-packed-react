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
spawnSync(hygen, ['apr-init', 'new', '--name', argv.dev ? 'playground' : argv.name || 'my-app'], {
  stdio: 'inherit'
})

if (argv.dev) {
  console.log('installing projects')
  const currentPath = process.cwd()
  const aprCliPath = join(__dirname, '../', 'apr-cli')
  const aprPath = join(__dirname, '../', 'action-packed-react')
  spawnSync('yarn', [], { stdio: 'inherit' })
  process.chdir(join(__dirname, '../apr-cli/'))
  spawnSync('yarn', ['link'], { stdio: 'inherit' })
  process.chdir(join(__dirname, '../playground/'))
  console.log('yarn', ['add', aprCliPath, aprPath], { stdio: 'inherit' })
  spawnSync('yarn', ['add', aprCliPath, aprPath], { stdio: 'inherit' })
  process.cwd(currentPath)
} else {
  spawnSync('yarn', [], { stdio: 'inherit' })
  spawnSync('yarn', ['add', 'apr-cli'], { stdio: 'inherit' })
  spawnSync('yarn', ['add', 'action-packed-react'], {
    stdio: 'inherit'
  })
}
