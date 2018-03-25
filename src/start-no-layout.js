const commander: any = require('commander')
const colors = require('colors')

const createEth = require('./eth')

commander
    .version('1.0.0')
    .option('-a, --api <key>', 'Infura API key')
    .option('-s, --start <n>', 'Blocks start', parseInt)
    .option('-e, --end <n>', 'Blocks end', parseInt)
    .parse(process.argv)

const requiredArgs = ['api', 'start', 'end']

const missingArgs = requiredArgs.filter(arg => commander[arg] === undefined)

if (missingArgs.length > 0) {
    console.log(
        `${colors.red('error:')}    Missing required argument${
            missingArgs.length > 1 ? 's' : ''
        } ${colors.blue(missingArgs.join(', '))}`
    )
    commander.help()
}

const infuraApiKey = commander.api

const { scanBlocks } = createEth(infuraApiKey)

const blockRange = {
    start: commander.start,
    end: commander.end
}

scanBlocks(blockRange, false)
