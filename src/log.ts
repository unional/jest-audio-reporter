import { state } from './state';

export function createLog() {
  return {
    enabled: false,
    debug(...args) {
      if (this.enabled && !state.devel) {
        // istanbul ignore next
        console.info(...args)
      }
    }
  }
}

export function logOptions({ log }, raw, options) {
  // if (noAudioDefined(options))

  log.debug(`configs location:
${raw.configs.map(c => `  ${c}`).join('\n')}

options:
${JSON.stringify(options, undefined, 2)}
`)
}
// function logNoAudio({ log }, raw) {
//   log.debug(`No audio found in configuration`)
// }

// function noAudioDefined(options) {
//   return (!options.onStart || options.onStart.length === 0) &&
//     (!options.onSuitePass || options.onSuitePass.length === 0) &&
//     (!options.onSuiteFailure || options.onSuiteFailure.length === 0)
// }
