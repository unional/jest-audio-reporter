import fs from 'fs';
import path from 'path';
import rc from 'rc';

export interface Options {
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

export function getProcessedRCOption(rawRCOptions) {
  // reversing the config so the first one is the closest.
  const dirs = rawRCOptions.configs ? rawRCOptions.configs.reverse().map(path.dirname) : []
  const onStart = processRCFileEntry(rawRCOptions.onStart, dirs)
  const onSuitePass = processRCFileEntry(rawRCOptions.onSuitePass, dirs)
  const onSuiteFailure = processRCFileEntry(rawRCOptions.onSuiteFailure, dirs)

  const onStartThreshold = rawRCOptions.onStartThreshold !== undefined ? parseInt(rawRCOptions.onStartThreshold, 10) : undefined

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

export function processOptions(rootDir: string, rcOptions, rawJestOptions): RuntimeOptions {
  const jestOptions = processJestOptions(rootDir, rawJestOptions)
  const options = {
    onStart: rcOptions.onStart.concat(jestOptions.onStart),
    onStartThreshold: processValueEntry(rcOptions.onStartThreshold, jestOptions.onStartThreshold, 3),
    onSuitePass: rcOptions.onSuitePass.concat(jestOptions.onSuitePass),
    onSuiteFailure: rcOptions.onSuiteFailure.concat(jestOptions.onSuiteFailure)
  }
  if (noAudioDefined(options)) {
    if (noAudioDefined(rcOptions) && noAudioDefined(jestOptions)) {
      console.warn('no audio file is specified for jest-audio-reporter.')
      console.warn(`Please configure it in jest config or in .jest-audio-reporterrc`)
    }
    else {
      // istanbul ignore next
      console.warn(`audio files specified in the configuration does not exist. Please check your jest config${
        rcOptions.configs ?
          ` or your rc files:\n${rcOptions.configs.join('\n')}` : ''
        }`)
    }
  }
  return options
}

function processJestOptions(rootDir: string, rawJestOptions) {
  return {
    onStart: processJestFileEntry(rootDir, rawJestOptions.onStart),
    onStartThreshold: rawJestOptions.onStartThreshold,
    onSuitePass: processJestFileEntry(rootDir, rawJestOptions.onSuitePass),
    onSuiteFailure: processJestFileEntry(rootDir, rawJestOptions.onSuiteFailure)
  }
}

function processJestFileEntry(rootDir: string, jestFiles) {
  const files: string[] = []

  if (typeof jestFiles === 'string') {
    files.push(resolvePath(rootDir, jestFiles))
  }
  else if (Array.isArray(jestFiles)) {
    files.push(...jestFiles.map(f => resolvePath(rootDir, f)))
  }

  return files.filter(f => fs.existsSync(f))
}

function processValueEntry(...options) {
  return options.find(o => o !== undefined)
}

function resolvePath(rootDir: string, path: string) {
  return path.replace(`<rootDir>`, rootDir)
}

function noAudioDefined(options) {
  return (!options.onStart || options.onStart.length === 0) &&
    (!options.onSuitePass || options.onSuitePass.length === 0) &&
    (!options.onSuiteFailure || options.onSuiteFailure.length === 0)
}
