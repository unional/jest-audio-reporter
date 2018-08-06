// import loader from 'audio-loader'
// import play from 'audio-play'
import Player from 'play-sound'

import { store } from './store'

interface Options {
  onStart: string | string[],
  onStartThreshold: number,
  onSuitePass: string | string[],
  onSuiteFailure: string | string[]
}

export = class AudioReporter {
  player = Player({})
  options
  constructor(public globalConfig: jest.GlobalConfig, options: Partial<Options>) {
    // console.info(globalConfig)
    if (Object.keys(options).length === 0) {
      throw new Error('jest-audio-reporter requires option to be specified.')
    }
    this.options = this.preProcessOptions(options)
  }
  onRunStart(_results: jest.AggregatedResult, options: jest.ReporterOnStartOptions) {
    if (store.completeAudio) {
      store.completeAudio.kill()
      store.completeAudio = undefined
    }

    if (options.estimatedTime <= this.options.onStartThreshold) return

    const file = pickOne(this.options.onStart)
    store.startAudio = this.player.play(file)
  }
  onRunComplete(_contexts, results: jest.AggregatedResult) {
    if (store.startAudio) {
      store.startAudio.kill()
      store.startAudio = undefined
    }
    if (results.numTotalTestSuites === 0) return
    if (results.wasInterrupted) return

    if (results.numFailedTestSuites === 0) {
      if (this.globalConfig.watch && store.doesLastRunPass) return
      store.doesLastRunPass = true
      if (this.options.onSuitePass.length === 0) return
      const file = pickOne(this.options.onSuitePass)
      return new Promise(a => {
        store.completeAudio = this.player.play(file, a)
      })
    }
    else {
      store.doesLastRunPass = false
      if (this.options.onSuiteFailure.length === 0) return
      const file = pickOne(this.options.onSuiteFailure)
      return new Promise(a => {
        store.completeAudio = this.player.play(file, a)
      })
    }
  }
  private preProcessOptions(options) {
    return {
      onStart: this.preProcessEntry(options.onStart),
      onSuitePass: this.preProcessEntry(options.onSuitePass),
      onSuiteFailure: this.preProcessEntry(options.onSuiteFailure),
      onStartThreshold: options.onStartThreshold || 3
    }
  }
  private preProcessEntry(entry) {
    if (!entry) return []

    if (typeof entry === 'string') {
      return [this.resolvePath(entry)]
    }
    if (Array.isArray(entry)) {
      return entry.map(e => this.resolvePath(e))
    }
  }

  private resolvePath(path: string) {
    return path.replace(`<rootDir>`, this.globalConfig.rootDir)
  }
}

function pickOne(arr: Array<any>) {
  return arr[Math.floor(Math.random() * arr.length)]
}
