import a from 'assertron';
import path from 'path';
import { getProcessedRCOption, processOptions } from './options';

describe('getProcessedRCOptions', () => {
  test('no config returns files as empty array', () => {
    a.satisfy(getProcessedRCOption({}), {
      onStart: [],
      onSuitePass: [],
      onSuiteFailure: []
    })
  })
  test(`onStartThreshold is parsed as int`, () => {
    a.satisfy(getProcessedRCOption({ onStartThreshold: '4' }), {
      onStartThreshold: 4
    })
  })
  test('simple string is convert to entry in array', () => {
    const cwd = process.cwd()
    const config = path.join(cwd, '.jest-audio-reporterrc')
    a.satisfy(getProcessedRCOption({ onStart: 'audio/昇格.mp3', config, configs: [config] }), {
      onStart: [path.resolve(cwd, 'audio/昇格.mp3')]
    })
  })
  test(`support absolute path`, () => {
    const cwd = process.cwd()
    const dirConfig = path.join(__dirname, '.jest-audio-reporterrc')
    const actual = path.resolve(cwd, 'audio/昇格.mp3')
    a.satisfy(getProcessedRCOption({ onStart: actual, config: dirConfig, configs: [dirConfig] }), {
      onStart: [actual]
    })
  })
  test(`support multiple config`, () => {
    const cwd = process.cwd()
    const config = path.join(cwd, '.jest-audio-reporterrc')
    const dirConfig = path.join(__dirname, '.jest-audio-reporterrc')
    const actual = path.resolve(cwd, 'audio/昇格.mp3')
    a.satisfy(getProcessedRCOption({ onStart: actual, config: dirConfig, configs: [config, dirConfig] }), {
      onStart: [actual]
    })

    a.satisfy(getProcessedRCOption({ onStart: actual, config, configs: [dirConfig, config] }), {
      onStart: [actual]
    })
  })
})


test('get info from rc file', () => {
  const cwd = process.cwd()
  const options = processOptions(cwd, {
    onStart: ['init-start.mp3'],
    onSuitePass: [],
    onSuiteFailure: []
  }, {})
  a.satisfy(options, {
    onStart: ['init-start.mp3'],
    onSuitePass: [],
    onSuiteFailure: []
  })
})

test('jest config merge with rc config', () => {
  const cwd = process.cwd()
  const options = processOptions(
    cwd,
    {
      onStart: ['init-start.mp3'],
      onSuitePass: [],
      onSuiteFailure: []
    },
    {
      onStart: 'audio/昇格.mp3'
    })
  a.satisfy(options, {
    onStart: ['init-start.mp3', 'audio/昇格.mp3'],
    onSuitePass: [],
    onSuiteFailure: []
  })
})
