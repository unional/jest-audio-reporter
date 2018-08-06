import a, { AssertOrder } from 'assertron'
import t from 'assert';

import AudioReporter from '.'
import { store } from './store';
test('no option throws', async () => {
  await a.throws(() => new AudioReporter(gc(), {}))
})

test('support rootDir', () => {
  const subject = new AudioReporter(gc({ rootDir: 'a' }), {
    onStart: '<rootDir>/b'
  })

  a.satisfy(subject.options.onStart, ['a/b'])
})

test('Will not play onSuitePass if no test ran', () => {
  const subject = new AudioReporter(gc(), {
    onSuitePass: 'somemusic.mp3'
  })
  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 0 }))
})

test('Will not play onStart if test estimated to take less than 3s to run', () => {
  const subject = new AudioReporter(gc(), {
    onStart: 'somemusic.mp3'
  })
  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunStart(ar(), { estimatedTime: 3, showStatus: false })
})

test('Will play onStart if test estimated to take more than 3s to run', () => {
  const subject = new AudioReporter(gc(), {
    onStart: 'somemusic.mp3'
  })
  const o = new AssertOrder(1)
  subject.player = { play() { o.once(1) } }
  subject.onRunStart(ar(), { estimatedTime: 3.01, showStatus: false })

  o.end()
})

test('pick one if onStart is an array', () => {
  const subject = new AudioReporter(gc(), {
    onStart: ['a.mp3', 'b.mp3']
  })
  const o = new AssertOrder(1)
  subject.player = {
    play(file) {
      o.once(1)
      t(file === 'a.mp3' || file === 'b.mp3')
    }
  }
  subject.onRunStart(ar(), { estimatedTime: 3.01, showStatus: false })

  o.end()
})
test('pick one if onSuitePass is an array', () => {
  const subject = new AudioReporter(gc(), {
    onSuitePass: ['a.mp3', 'b.mp3']
  })
  const o = new AssertOrder(1)
  subject.player = {
    play(file) {
      o.once(1)
      t(file === 'a.mp3' || file === 'b.mp3')
    }
  }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
  o.end()
})
test('pick one if onSuiteFailure is an array', () => {
  const subject = new AudioReporter(gc(), {
    onSuiteFailure: ['a.mp3', 'b.mp3']
  })
  const o = new AssertOrder(1)
  subject.player = {
    play(file) {
      o.once(1)
      t(file === 'a.mp3' || file === 'b.mp3')
    }
  }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
  o.end()
})

describe('watch mode', () => {
  test('play onSuitePass on first run', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'somemusic.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass on second pass', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'somemusic.mp3'
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
      onSuitePass: 'somemusic.mp3'
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.exactly(1, 2) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass/Failure on interruption', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onSuitePass: 'a.mp3',
      onSuiteFailure: 'b.mp3'
    })
    store.reset()

    subject.player = { play() { throw new Error('should not play') } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0, wasInterrupted: true }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1, wasInterrupted: true }))
  })
  test('kill onStart when run completes', () => {
    const subject = new AudioReporter(gc({ watch: true }), {
      onStart: 'somemusic.mp3'
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
      onSuitePass: 'somemusic.mp3'
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
      onSuiteFailure: 'somemusic.mp3'
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
