# jest-audio-reporter

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![Github NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]

[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

Play a tune while running [`jest`](https://jestjs.io/).

## Requirements

`jest-audio-reporter` is an ES module. It needs Node 20+ and Jest 27+
(Jest loads a reporter with `requireOrImportModule`, which imports an ES module).
`require('jest-audio-reporter')` is not supported.

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

[codecov-image]: https://codecov.io/gh/repobuddy/jest-audio-reporter/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/repobuddy/jest-audio-reporter
[coveralls-image]: https://coveralls.io/repos/github/repobuddy/jest-audio-reporter/badge.svg
[coveralls-url]: https://coveralls.io/github/repobuddy/jest-audio-reporter
[downloads-image]: https://img.shields.io/npm/dm/jest-audio-reporter.svg?style=flat
[downloads-url]: https://npmjs.org/package/jest-audio-reporter
[github-nodejs]: https://github.com/repobuddy/jest-audio-reporter/actions/workflows/release.yml/badge.svg
[github-action-url]: https://github.com/repobuddy/jest-audio-reporter/actions/workflows/release.yml
[npm-image]: https://img.shields.io/npm/v/jest-audio-reporter.svg?style=flat
[npm-url]: https://npmjs.org/package/jest-audio-reporter
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
