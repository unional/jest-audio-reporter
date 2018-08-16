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
  log.debug(`configs location:
${raw.configs.map(c => `  ${c}`).join('\n')}

options:
${JSON.stringify(options, undefined, 2)}
`)
}
