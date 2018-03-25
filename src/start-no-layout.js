const commander = require('commander')

const createEth = require('./eth')

commander
    .version('0.1.0')
    .option('-a, --api <key>', 'Infura API key')
    .option('-s, --start <n>', 'Blocks start', parseInt)
    .option('-e, --end <n>', 'Blocks end', parseInt)
    .parse(process.argv)

// if (!commander.api) {
//     throw new Error('Infura API key is required')
// }
// process.env.INFURA_API_KEY = commander.api

const infuraApiKey = commander.api

const { scanBlocks } = createEth(infuraApiKey)

const blockRange = {
    start: commander.start,
    end: commander.end
}

scanBlocks(blockRange, false)
