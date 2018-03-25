const fs = require('fs')
const colors = require('colors/safe')
const ProgressBar = require('progress')

const { ensureDirExists } = require('./files')
const { logFilename } = require('./config')

type Level = 'LOG' | 'ERROR'

function logDate() {
    return `[${new Date().toISOString()}]`
}

function uncoloredLog(level: Level, str: string) {
    const prefix = level === 'LOG' ? 'log:   ' : 'error: '
    return `${prefix} ${logDate()} ${str}`
}

function coloredLog(level: Level, str: string) {
    const prefix = level === 'LOG' ? 'log:   ' : 'error: '
    const prefixColor = level === 'LOG' ? colors.green : colors.red
    return `${prefixColor(prefix)} ${colors.bold(logDate())} ${str}`
}

function createLogStream(path: string) {
    ensureDirExists(path)
    return fs.createWriteStream(path)
}

function createLogger(path: string) {
    const stream = createLogStream(path)
    return {
        log: (str: string) => {
            console.log(coloredLog('LOG', str))
            stream.write(uncoloredLog('LOG', str) + '\n')
        },
        error: (str: string) => {
            console.log(coloredLog('ERROR', str))
            stream.write(uncoloredLog('ERROR', str) + '\n')
        },
        end: () => {
            stream.end()
        },
        progress: (message: string, maxTicks: number) => {
            stream.write(uncoloredLog('LOG', message) + '\n')
            return new ProgressBar(
                `${coloredLog(
                    'LOG',
                    colors.cyan(message)
                )} [:bar] :current/:total`,
                { total: maxTicks, head: '>', width: 30 }
            )
        }
    }
}

module.exports = createLogger(logFilename())
