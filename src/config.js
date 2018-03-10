const { ensureDirExists } = require('./files')

const baseFilename = `eth-h${new Date().getHours()}`

const logFilename = './logs/' + baseFilename + '.log'
const jsonFilename = './graphs/' + baseFilename + '.json'
const pajekFilename = './graphs/' + baseFilename + '.net'

ensureDirExists(logFilename)
ensureDirExists(jsonFilename)
ensureDirExists(pajekFilename)

module.exports = {
    jsonFilename,
    logFilename,
    pajekFilename
}
