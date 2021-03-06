# jest-audio-reporter

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![CircleCI status][circleci-image]][circleci-url]
[![Travis status][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coveralls Status][coveralls-image]][coveralls-url]

[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

Play a tune while running [`jest`](https://jestjs.io/).

## Usage

To use `jest-audio-reporter`,
add it to the `reporters` section of the Jest configuration:

```js
{
  "jest": {
    "reporters": [
      "default", // using default reporter
      "jest-audio-reporter",
      // Adjust volume 0 (silent) - 1 (normal)
      ["jest-audio-reporter", { volume: 1, onStartVolume: 1, onCompleteVolume: 1 }]
      // disable it
      ["jest-audio-reporter", { disable: true }]
      // to enable debug mode to see why no tune is playing
      ["jest-audio-reporter", { debug: true }]
    ]
  }
}
```

## Configuration

To configure `jest-audio-reporter`, you need to create a `.jest-audio-reporterrc` file.
For example:

```js
{
  "onStart": "<path(s)-to-audio>",
  "onStartThreshold": 10,
  "onSuitePass": "<path(s)-to-audio>",
  "onSuiteFailure": "<path(s)-to-audio>"
}
```

Most likely you will put this file under the root of all your projects or in your home folder.
Please refer to [`rc`](https://www.npmjs.com/package/rc) for more information.

## Options

- `onStart: string | string[]`: Specify the audio file(s) to play when the test suite starts. When specifying an array, one of the file will be picked at random.
- `onStartThreshold: number`: `onStart` will not play audio if the tests are estimated to finish less when this threshold. Default is 3 seconds.
- `onSuitePass: string | string[]`: Specify the audio file(s) to play when the test suite passes. When specifying an array, one of the file will be picked at random.
- `onSuiteFailure: string | string[]`: Specify the audio file(s) to play when the test suite failes. When specifying an array, one of the file will be picked at random.

## Watch mode

When `jest` is running in watch mode, the following special behavior applies:

- `onSuitePass` will play only on first run and when the test suite recoveres from failure.

## For Windows

`jest-audio-reporter` uses [`play-sound`](https://www.npmjs.com/package/play-sound) internally.
For Windows, you will need to install [`mplayer`](https://www.mplayerhq.hu/).

## Audio Copyright Disclaimer

In order to avoid potential copyright issue, no audio files are included in the package.

The audio files used for testing in this repository comes from <https://dova-s.jp>

Please refer to them for copyright information.

[circleci-image]: https://circleci.com/gh/unional/jest-audio-reporter/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/jest-audio-reporter/tree/master
[codecov-image]: https://codecov.io/gh/unional/jest-audio-reporter/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/jest-audio-reporter
[coveralls-image]: https://coveralls.io/repos/github/unional/jest-audio-reporter/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/jest-audio-reporter
[downloads-image]: https://img.shields.io/npm/dm/jest-audio-reporter.svg?style=flat
[downloads-url]: https://npmjs.org/package/jest-audio-reporter
[greenkeeper-image]: https://badges.greenkeeper.io/unional/jest-audio-reporter.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-image]: https://img.shields.io/npm/v/jest-audio-reporter.svg?style=flat
[npm-url]: https://npmjs.org/package/jest-audio-reporter
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[travis-image]: https://img.shields.io/travis/unional/jest-audio-reporter/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/jest-audio-reporter?branch=master
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
