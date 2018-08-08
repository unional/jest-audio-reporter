import a from 'assertron';
import path from 'path';
import { processOptions } from './options';

test('can read ini format', () => {
  const cwd = process.cwd()
  process.chdir(path.resolve('fixtures/ini'))
  try {
    const options = processOptions(cwd, {})
    a.satisfy(options, {
      onStart: ['init-start.mp3'],
      onStartThreshold: 3
    })
  }
  finally {
    process.chdir(cwd)
  }
})

test('can read json format', () => {
  const cwd = process.cwd()
  process.chdir(path.resolve('fixtures/json'))
  try {
    const options = processOptions(cwd, {})
    a.satisfy(options, {
      onStart: ['init-start.mp3'],
      onStartThreshold: 3
    })
  }
  finally {
    process.chdir(cwd)
  }
})

test('can read array in init', () => {
  const cwd = process.cwd()
  process.chdir(path.resolve('fixtures/ini-array'))
  try {
    const options = processOptions(cwd, {})
    a.satisfy(options, {
      onStart: ['init-start.mp3', 'init-start2.mp3'],
      onStartThreshold: 3
    })
  }
  finally {
    process.chdir(cwd)
  }
})
