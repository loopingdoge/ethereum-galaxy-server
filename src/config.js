const howOftenToRun = process.env.ETH_HOURS || 1

const baseFilename = () => `eth-${howOftenToRun}/${new Date().getHours()}`

const logFilename = () => `./logs/${baseFilename()}.log`
const jsonFilename = () => `./graphs/${baseFilename()}/graph.json`
const infoFilename = () => `./graphs/${baseFilename()}/info.json`
const pajekFilename = () => `./graphs/${baseFilename()}/graph.net`

const ngraphBasePath = () => `./graphs/${baseFilename()}/ngraph/`

module.exports = {
    baseFilename,
    jsonFilename,
    infoFilename,
    logFilename,
    pajekFilename,
    ngraphBasePath
}
