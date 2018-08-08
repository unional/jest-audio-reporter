import t from 'assert';
import a, { AssertOrder } from 'assertron';
import path from 'path';
import AudioReporter from '.';
import { store } from './store';

test('support rootDir', () => {
  const rootDir = process.cwd()
  const subject = new AudioReporter(gc({ rootDir }), {
    onStart: '<rootDir>/audio/昇格.mp3'
  })

  a.satisfy(subject.options.onStart, [path.resolve(rootDir, 'audio/昇格.mp3')])
})

test('Will not play onSuitePass if no test ran', () => {
  const subject = new AudioReporter(gc(), {
    onSuitePass: 'audio/昇格.mp3'
  })
  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 0 }))
})

test('Will not play onStart if test estimated to take less than 3s to run', () => {
  const subject = new AudioReporter(gc(), {
    onStart: 'audio/昇格.mp3'
  })
  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunStart(ar(), { estimatedTime: 3, showStatus: false })
})

test('Will play onStart if test estimated to take more than 3s to run', () => {
  const subject = new AudioReporter(gc(), {
    onStart: 'audio/昇格.mp3'
  })
  const o = new AssertOrder(1)
  subject.player = { play() { o.once(1) } }
  subject.onRunStart(ar(), { estimatedTime: 3.01, showStatus: false })

  o.end()
})

test('pick one if onStart is an array', () => {
  const subject = new AudioReporter(gc(), {
    onStart: ['audio/昇格.mp3', 'audio/勝利ジングル.mp3']
  })
  const o = new AssertOrder(1)
  subject.player = {
    play(file) {
      o.once(1)
      t(subject.options.onStart.indexOf(file) >= 0)
    }
  }
  subject.onRunStart(ar(), { estimatedTime: 3.01, showStatus: false })

  o.end()
})
test('pick one if onSuitePass is an array', () => {
  const subject = new AudioReporter(gc(), {
    onSuitePass: ['audio/昇格.mp3', 'audio/勝利ジングル.mp3']
  })
  const o = new AssertOrder(1)
  subject.player = {
    play(file) {
      o.once(1)
      t(subject.options.onSuitePass.indexOf(file) >= 0)
    }
  }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
  o.end()
})
test('pick one if onSuiteFailure is an array', () => {
  const subject = new AudioReporter(gc(), {
    onSuiteFailure: ['audio/昇格.mp3', 'audio/勝利ジングル.mp3']
  })
  const o = new AssertOrder(1)
  subject.player = {
    play(file) {
      o.once(1)
      t(subject.options.onSuiteFailure.indexOf(file) >= 0)
    }
  }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
  o.end()
})

describe('watch mode', () => {
  test('play onSuitePass on first run', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'audio/昇格.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass on second pass', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'audio/昇格.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('play onSuitePass again on pass after failure', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'audio/昇格.mp3',
      onSuiteFailure: 'audio/昇格.mp3'
    })
    store.reset()
    const o = new AssertOrder(1)
    subject.player = {
      play() {
        o.exactly(1, 3)
      }
    }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass/Failure on interruption', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'audio/昇格.mp3',
      onSuiteFailure: 'audio/昇格.mp3'
    })
    store.reset()

    subject.player = { play() { throw new Error('should not play') } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0, wasInterrupted: true }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1, wasInterrupted: true }))
  })
  test('kill onStart when run completes', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onStart: 'audio/昇格.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunStart(ar(), { estimatedTime: 4, showStatus: false })
    subject.onRunComplete({}, ar())
    o.end()
  })
  test('kill onSuitePass when run starts', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'audio/昇格.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunStart(ar(), { estimatedTime: 4, showStatus: false })
    o.end()
  })
  test('kill onSuiteFailure when run starts', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuiteFailure: 'audio/昇格.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
    subject.onRunStart(ar(), { estimatedTime: 4, showStatus: false })
    o.end()
  })
})

function gc(config: Partial<jest.GlobalConfig> = {}) {
  return config as jest.GlobalConfig
}

function ar(results: Partial<jest.AggregatedResult> = {}) {
  return results as jest.AggregatedResult
}
