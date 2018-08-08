import Player from 'play-sound';
import { getProcessedRCOption, Options, processOptions, rawRCOptions, RuntimeOptions } from './options';
import { store } from './store';

const rcOptions = getProcessedRCOption(rawRCOptions)

export = class AudioReporter {
  player = Player({})
  options: RuntimeOptions
  constructor(public globalConfig: jest.GlobalConfig, options: Partial<Options>) {
    this.options = processOptions(globalConfig.rootDir, rcOptions, options)
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
      if (isWatch(this.globalConfig) && store.doesLastRunPass) return
      store.doesLastRunPass = true
      return this.playComplete(pickOne(this.options.onSuitePass))
    }
    else {
      store.doesLastRunPass = false
      return this.playComplete(pickOne(this.options.onSuiteFailure))
    }
  }
  private playComplete(file: string | undefined) {
    console.log(this.globalConfig)
    if (!file) return
    if (isWatch(this.globalConfig)) {
      store.completeAudio = this.player.play(file)
    }
    else {
      return new Promise(a => {
        store.completeAudio = this.player.play(file, a)
      })
    }
  }
}

function pickOne(arr: Array<any>) {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

function isWatch(globalConfig) {
  return globalConfig.watch || globalConfig.watchAll || globalConfig.watchman
}
