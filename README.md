# jest-audio-reporter

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[![Greenkeeper badge][green-keeper-image]][green-keeper-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

Audio reporter for [`jest`](https://jestjs.io/)

```js
// package.json
{
  "jest": {
    "reporters": [
      "default",
      [ "jest-audio-reporter", {
        "onStart": "<path-to-audio>",
        "onSuitePass": "<path-to-audio>",
        "onSuiteFailure": "<path-to-audio>"
      }]
    ]
  }
}
```

## Audio Copyright Disclaimer

In order to avoid potential licensing issue, no audio files are included in the package.

The audio files used for testing in the repository comes from

- <https://dova-s.jp>
- <https://www.woodus.com/den/music/>

Please refer to them for copyright information.

[npm-image]: https://img.shields.io/npm/v/jest-audio-reporter.svg?style=flat
[npm-url]: https://npmjs.org/package/jest-audio-reporter
[downloads-image]: https://img.shields.io/npm/dm/jest-audio-reporter.svg?style=flat
[downloads-url]: https://npmjs.org/package/jest-audio-reporter
[travis-image]: https://img.shields.io/travis/unional/jest-audio-reporter/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/jest-audio-reporter?branch=master
[codecov-image]: https://codecov.io/gh/unional/jest-audio-reporter/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/jest-audio-reporter
[coveralls-image]: https://coveralls.io/repos/github/unional/jest-audio-reporter/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/jest-audio-reporter
[green-keeper-image]:
https://badges.greenkeeper.io/unional/jest-audio-reporter.svg
[green-keeper-url]:https://greenkeeper.io/
[semantic-release-image]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
