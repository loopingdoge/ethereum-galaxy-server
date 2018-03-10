const fs = require('fs')
const colors = require('colors/safe')

const { logFilename } = require('./config')

const LOG = 'LOG'
const ERROR = 'ERROR'

function logDate() {
    return `[${new Date().toISOString()}]`
}

function uncoloredLog(level, str) {
    const prefix = level === LOG ? 'log:   ' : 'error: '
    return `${prefix} ${logDate()} ${str}`
}

function coloredLog(level, str) {
    const prefix = level === LOG ? 'log:   ' : 'error: '
    const prefixColor = level === LOG ? colors.green : colors.red
    return `${prefixColor(prefix)} ${colors.bold(logDate())} ${str}`
}

function createLogStream(path) {
    return fs.createWriteStream(path)
}

function createLogger(path) {
    const stream = createLogStream(path)
    return {
        log: str => {
            console.log(coloredLog(LOG, str))
            stream.write(uncoloredLog(LOG, str) + '\n')
        },
        error: str => {
            console.log(coloredLog(ERROR, str))
            stream.write(uncoloredLog(ERROR, str) + '\n')
        },
        end: () => {
            stream.end()
        }
    }
}

module.exports = createLogger(logFilename)
