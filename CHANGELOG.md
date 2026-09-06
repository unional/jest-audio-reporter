# jest-audio-reporter

## 3.0.0

### Major Changes

- 2ac0273: Ship ESM only.
  
  The package is now `"type": "module"` and the build emits a single ES module output at
  `esm/` (it used to emit CommonJS at `cjs/`). There is no CommonJS entry any more.
  
  Migration:
  
  - Requires Jest 27 or later. Jest loads custom reporters with `requireOrImportModule`,
    which falls back to `await import()` on an ESM module — support for ESM reporters
    landed in Jest 27. Jest 28+ is what the exports map is aimed at; on Jest 27, which
    ignores `exports`, `main` points at the same ES module.
  - Requires Node 20 or later (`import`-capable Node with `exports` support).
  - `require('jest-audio-reporter')` no longer works. Nothing changes for the documented
    usage — listing `"jest-audio-reporter"` in Jest's `reporters` keeps working as before.
  - The exports map deliberately publishes the ES module under the `default` condition
    rather than `import`: Jest resolves reporter paths with the default condition set
    (`require`, `node`, `default`) and never asks for `import`, so an `import`-only map
    fails to resolve with "Could not resolve a module for a custom reporter".

### Patch Changes

- a1b1c92: Declare a supported Node range: `^20.19.0 || ^22.13.0 || >=24`.
  
  Every version in that range has unflagged `require(esm)`, so a CommonJS consumer's
  `require()` of this now-ESM-only package resolves rather than throwing `ERR_REQUIRE_ESM`.
  Node 18 (EOL April 2025) and Node 20.0–20.18 are excluded because `require()` hard-fails there.

## 2.2.5

### Patch Changes

- d198c40: Support jest 30 alongside jest 29.
  
  `@jest/reporters`, `@jest/test-result` and `@jest/types` now accept `^29.0.0 || ^30.0.0`
  rather than `^29.0.0` only, so the reporter installs cleanly next to either jest major.
  The reporter's own API is unchanged.
  
  The compile target also moves from `es2015` to `es2022`, which changes the emitted
  JavaScript in `cjs/`. No new API, so this is a patch.

## 2.2.4

### Patch Changes

- 9ff00e1: Align the `@jest/*` dependencies on 29.x. `@jest/test-result` was pinned to `^27.4.6`
  while `@jest/reporters` and `@jest/types` were already on `^29.0.0`; under pnpm's strict
  resolution the 27.x copy of `jest-haste-map` won and `@jest/test-result`'s type
  declarations failed to compile (`TS2614: Module '"jest-haste-map"' has no exported member
  'IHasteFS'`). yarn's hoisting had been masking the mismatch.
  
  Stop shipping the test files. `files: ["cjs", "ts"]` put `ts/AudioReporter.spec.ts`,
  `ts/log.spec.ts` and `ts/options.spec.ts` in the published tarball; `"!ts/**/*.spec.ts"`
  excludes them while keeping the sources the source maps point at.
