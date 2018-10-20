module.exports = {
  'preset': 'ts-jest',
  'globals': {
    'ts-jest': {
      'diagnostics': false
    }
  },
  'reporters': [
    'default',
    '<rootDir>/dist/index.js'
  ],
  'roots': [
    '<rootDir>/src'
  ],
  'testEnvironment': 'node',
  'watchPlugins': [
    [
      'jest-watch-suspend'
    ],
    [
      'jest-watch-toggle-config',
      {
        'setting': 'verbose'
      }
    ],
    [
      'jest-watch-toggle-config',
      {
        'setting': 'collectCoverage'
      }
    ]
  ]
}
