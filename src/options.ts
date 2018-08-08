import fs from 'fs'
import rc from 'rc'

export interface Options {
  onStart?: string | string[],
  onStartThreshold: number,
  onSuitePass?: string | string[],
  onSuiteFailure?: string | string[]
}

export function processOptions(rootDir: string, jestOptions): Options {
  const options = rc('jest-audio-reporter')

  return {
    onStart: processFileEntry(rootDir, options.onStart, jestOptions.onStart),
    onStartThreshold: processValueEntry(options.onStartThreshold, jestOptions.onStartThreshold, 3),
    onSuitePass: processFileEntry(rootDir, options.onSuitePass, jestOptions.onSuitePass),
    onSuiteFailure: processFileEntry(rootDir, options.onSuiteFailure, jestOptions.onSuiteFailure)
  }
}

function processValueEntry(...options) {
  return options.find(o => o !== undefined)
}
function processFileEntry(rootDir: string, rcFiles: string | string[] | undefined, jestFiles: string | string[] | undefined) {
  const files: string[] = []
  if (typeof rcFiles === 'string') {
    files.push(resolvePath(rootDir, rcFiles))
  }
  else if (Array.isArray(rcFiles)) {
    files.push(...rcFiles.map(f => resolvePath(rootDir, f)))
  }

  if (typeof jestFiles === 'string') {
    files.push(resolvePath(rootDir, jestFiles))
  }
  else if (Array.isArray(jestFiles)) {
    files.push(...jestFiles.map(f => resolvePath(rootDir, f)))
  }

  return files.filter(f => fs.existsSync(f))
}

function resolvePath(rootDir: string, path: string) {
  return path.replace(`<rootDir>`, rootDir)
}
