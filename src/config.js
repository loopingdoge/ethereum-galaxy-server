const { ensureDirExists } = require('./files')

const howOftenToRun = process.env.ETH_HOURS

const baseFilename = `eth-${howOftenToRun}/${new Date().getHours()}`

const logFilename = `./logs/${baseFilename}.log`
const jsonFilename = `./graphs/${baseFilename}/graph.json`
const pajekFilename = `./graphs/${baseFilename}/graph.net`

const ngraphBasePath = `./graphs/${baseFilename}/ngraph/`

ensureDirExists(logFilename)
ensureDirExists(jsonFilename)
ensureDirExists(pajekFilename)
ensureDirExists(ngraphBasePath)

module.exports = {
    baseFilename,
    jsonFilename,
    logFilename,
    pajekFilename,
    ngraphBasePath
}
