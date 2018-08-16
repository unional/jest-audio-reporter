import fs from 'fs';
import path from 'path';
import rc from 'rc';

export interface Options {
  debug: boolean,
  onStart: string | string[],
  onStartThreshold: number,
  onSuitePass: string | string[],
  onSuiteFailure: string | string[]
}

export interface RuntimeOptions {
  onStart: string[],
  onStartThreshold: number,
  onSuitePass: string[],
  onSuiteFailure: string[]
}

export const rawRCOptions = rc('jest-audio-reporter')

export function processOptions(rawRCOptions) {
  // reversing the config so the first one is the closest.
  const dirs = rawRCOptions.configs ? rawRCOptions.configs.map(path.dirname) : []
  const onStart = processRCFileEntry(rawRCOptions.onStart, dirs)
  const onSuitePass = processRCFileEntry(rawRCOptions.onSuitePass, dirs)
  const onSuiteFailure = processRCFileEntry(rawRCOptions.onSuiteFailure, dirs)

  const onStartThreshold = rawRCOptions.onStartThreshold !== undefined ? parseInt(rawRCOptions.onStartThreshold, 10) : 3

  return {
    onStartThreshold,
    onStart,
    onSuitePass,
    onSuiteFailure
  }
}

function processRCFileEntry(files: string | string[] | undefined, dirs: string[]) {
  if (!files) return []
  const entries = typeof files === 'string' ? [files] : files
  const validFiles: string[] = []
  entries.forEach(e => {
    if (path.isAbsolute(e)) {
      validFiles.push(e)
    }
    else {
      const file = dirs.map(dir => path.resolve(dir, e)).find(p => fs.existsSync(p))
      if (file) {
        validFiles.push(file)
      }
    }
  })
  return validFiles
}
