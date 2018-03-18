const express = require('express')
const commander = require('commander')

const { eth, lastBlock } = require('./eth')

// const app = express()

// commander
//   .version('0.1.0')
//   .option('-h, --hours <n>', 'How often to run the script', parseInt)
//   .parse(process.argv);

// console.log("Peppers: " + commander.peppers)
;(async () => {
    if (!process.env.INFURA_API_KEY) {
        throw new Error('INFURA_API_KEY env variable not found')
    }

    const lastBlockNumber = await lastBlock()

    const blockRange = {
        start: lastBlockNumber - 20,
        end: lastBlockNumber
    }

    eth(blockRange)
})()

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
