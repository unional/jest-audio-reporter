// import loader from 'audio-loader'
// import play from 'audio-play'
import Player from 'play-sound'

const player = Player({})
export = class AudioReporter {
  startAudio
  completeAudio
  constructor(public globalConfig: jest.GlobalConfig, public options) { }
  onRunStart(results: jest.AggregatedResult, options: jest.ReporterOnStartOptions) {
    if (this.completeAudio) {
      this.completeAudio.kill()
      this.completeAudio = undefined
    }
    const option = this.options.onStart

    if (typeof option === 'string') {
      this.startAudio = player.play(option)
    }
  }
  onRunComplete(contexts, results: jest.AggregatedResult) {
    if (this.startAudio) {
      this.startAudio.kill()
      this.startAudio = undefined
    }
    const audioFile = results.numFailedTestSuites === 0 ?
      this.options.onSuitePass :
      this.options.onSuiteFailure
    this.completeAudio = player.play(audioFile)
  }
}
