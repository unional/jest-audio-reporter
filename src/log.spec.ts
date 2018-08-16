import t from 'assert'
import { logOptions } from './log';

test('log config location and option', () => {
  const c = context()
  logOptions(c, {
    onSuitePass: ['music1.mp3'],
    configs: [
      'rcfile1',
      'rcfile2'
    ]
  }, { onSuitePass: ['music1.mp3'] })
  t.deepStrictEqual(c.log.messages, [
    [`configs location:
  rcfile1
  rcfile2

options:
{
  "onSuitePass": [
    "music1.mp3"
  ]
}
`]
  ])
})


function context() {
  return {
    log: {
      debug(...args) {
        this.messages.push(args)
      },
      messages: []
    }
  }
}
