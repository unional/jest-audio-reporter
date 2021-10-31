// const findExec = require('find-exec')
// findExec(['mplayer'])

const { execSync } = require('child_process')


const result = execSync('where explorer', { stdio: 'inherit' })

console.log('result', result)
