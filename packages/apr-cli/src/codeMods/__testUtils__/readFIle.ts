jest.autoMockOff()
import { join } from 'path';
import fs from 'fs'

export function readFile(dirName: string, filePath: string) {
  return fs.readFileSync(join(dirName, filePath)).toString()
}
