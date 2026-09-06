/**
 * The package is ESM (`"type": "module"`), but the specs still run through ts-jest's
 * CommonJS transform: jest only treats `.ts` as ESM when it is listed in
 * `extensionsToTreatAsEsm`, and native ESM in jest still needs
 * `--experimental-vm-modules`. So the transform pins `module: commonjs` regardless of
 * what the build tsconfig says, and `moduleNameMapper` maps the ESM-mandated `./x.js`
 * specifiers back onto the TypeScript sources.
 */
/** @type {import('jest').Config} */
export default {
	collectCoverageFrom: ['<rootDir>/ts/**/*.[jt]s', '!<rootDir>/ts/bin.[jt]s'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1'
	},
	roots: ['<rootDir>/ts'],
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(spec|test|integrate|accept|system|unit).[jt]s?(x)'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: {
					esModuleInterop: true,
					module: 'commonjs',
					moduleResolution: 'node',
					target: 'es2022'
				}
			}
		]
	}
}
