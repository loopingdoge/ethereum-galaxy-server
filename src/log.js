const fs = require('fs')

const { logFilename } = require('./config')

function logDate() {
    return new Date().toISOString()
}

function createLogStream(path) {
    return fs.createWriteStream(path)
}

function createLogger(path) {
    const stream = createLogStream(path)
    return {
        log: str => {
            const logStr = `${logDate()} - log - ${str}`
            console.log(logStr)
            stream.write(logStr + '\n')
        },
        error: str => {
            const logStr = `${logDate()} - error - ${str}`
            console.error(logStr)
            stream.write(logStr + '\n')
        },
        end: () => {
            stream.end()
        }
    }
}

module.exports = createLogger(logFilename)
