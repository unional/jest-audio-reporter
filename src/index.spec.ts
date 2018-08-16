import t from 'assert';
import { AssertOrder } from 'assertron';
import AudioReporter from '.';
import { RuntimeOptions } from './options';
import { store } from './store';

test('Will not play onSuitePass if no test ran', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({ onSuitePass: ['audio/onSuitePass/昇格.mp3'] })

  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 0 }))
})

test('Will not play onStart if test estimated to take less than 3s to run', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onSuitePass: ['audio/onSuitePass/昇格.mp3']
  })

  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunStart(ar(), { estimatedTime: 3, showStatus: false })
})

test('Will play onStart if test estimated to take more than 3s to run', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({ onSuitePass: ['audio/onSuitePass/昇格.mp3'] })

  const o = new AssertOrder(1)
  subject.player = { play() { o.once(1) } }
  subject.onRunStart(ar(), { estimatedTime: 3.01, showStatus: false })

  o.end()
})

test('Will play onStart if there is no estimate', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({ onSuitePass: ['audio/onSuitePass/昇格.mp3'] })

  const o = new AssertOrder(1)
  subject.player = { play() { o.once(1) } }
  subject.onRunStart(ar({ numTotalTestSuites: 1 }), { estimatedTime: 0, showStatus: false })

  o.end()
})


test('pick one if onStart has more than one entry', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onStart: ['audio/onSuitePass/昇格.mp3', 'audio/onSuitePass/勝利ジングル.mp3']
  })

  const calls = [0, 0]
  subject.player = {
    play(file) {
      calls[subject.options.onStart.indexOf(file)]++
    }
  }
  for (let i = 0; i < 100; i++)
    subject.onRunStart(ar(), { estimatedTime: 3.01, showStatus: false })

  t(calls[0] * calls[1] > 0)
})
test('pick one if onSuitePass is an array', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onSuitePass: ['audio/onSuitePass/昇格.mp3', 'audio/onSuitePass/勝利ジングル.mp3']
  })
  const calls = [0, 0]
  subject.player = {
    play(file) {
      calls[subject.options.onSuitePass.indexOf(file)]++
    }
  }
  for (let i = 0; i < 100; i++)
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))

  t(calls[0] * calls[1] > 0)
})
test('pick one if onSuiteFailure is an array', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onSuiteFailure: ['audio/onSuitePass/昇格.mp3', 'audio/onSuitePass/勝利ジングル.mp3']
  })
  const calls = [0, 0]
  subject.player = {
    play(file) {
      calls[subject.options.onSuiteFailure.indexOf(file)]++
    }
  }
  for (let i = 0; i < 100; i++)
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))

  t(calls[0] * calls[1] > 0)
})

describe('watch mode', () => {
  test('play onSuitePass on first run', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass on second pass', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('play onSuitePass again on pass after failure', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3'],
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3']
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
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3'],
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    subject.player = { play() { throw new Error('should not play') } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0, wasInterrupted: true }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1, wasInterrupted: true }))
  })
  test('kill onStart when run completes', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onStart: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunStart(ar(), { estimatedTime: 4, showStatus: false })
    subject.onRunComplete({}, ar())
    o.end()
  })
  test('kill onSuitePass when run starts', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onStart: ['audio/onSuitePass/昇格.mp3'],
      onSuitePass: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunStart(ar(), { estimatedTime: 4, showStatus: false })
    o.end()
  })
  test('kill onSuiteFailure when run starts', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onStart: ['audio/onSuitePass/昇格.mp3'],
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
    subject.onRunStart(ar(), { estimatedTime: 4, showStatus: false })
    o.end()
  })
})

test('when debug = true, log is enabled', () => {
  store.devel = true
  try {
    const subject = new AudioReporter(gc(), { debug: true })
    t.strictEqual(subject.log.enabled, true)
  }
  catch {
    store.devel = false
  }
})

test('when debug = false, log is not enabled', () => {
  const subject = new AudioReporter(gc(), { debug: false })
  t.strictEqual(subject.log.enabled, false)
})

function gc(config: Partial<jest.GlobalConfig> = {}) {
  return config as jest.GlobalConfig
}

function ar(results: Partial<jest.AggregatedResult> = {}) {
  return results as jest.AggregatedResult
}


function runtimeOptions(options: Partial<RuntimeOptions>) {
  return {
    onStart: [],
    onSuitePass: [],
    onSuiteFailure: [],
    onStartThreshold: 3,
    ...options
  }
}
