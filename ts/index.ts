import { store } from './store.js'

// istanbul ignore next
process.on('exit', () => {
	if (store.startAudio) store.startAudio.kill()
	if (store.completeAudio) store.completeAudio.kill()
})

import { AudioReporter } from './AudioReporter.js'

export default AudioReporter
