import { join } from 'path';
import { spawnSync } from 'child_process';
import debug from 'debug'
const log = debug('apr:runApr')
export const runApr = (args: string[]|string, {snapshotOutput = false} = {}) => {
  if(typeof args === 'string'){
    args = args.split(/\s/g)
  }
  process.chdir(join(__dirname, '../../../../playground'))
  log('running: ', 'apr', args)
  const result = spawnSync('apr', args)
  if(result.status !== 0) {
    throw new Error('Unsuccessful apr command: ' + ['apr', ...args].join(' '))
  }
  const output = result.output.toString()
  if(snapshotOutput) {
    expect(output).toMatchSnapshot(args.join(' '))
  }
  return output
}
