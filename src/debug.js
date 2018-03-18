// const logger = require('./log')

// const progress = logger.progress('calculating layout', 300)

// const timer = setInterval(() => {
//     progress.tick()
//     if (progress.complete) {
//         console.log('complete')
//         clearInterval(timer)
//     }
// }, 100)

const express = require('express')
const schedule = require('node-schedule')

const createEth = require('./eth')

if (!process.env.INFURA_API_KEY) {
    throw new Error('INFURA_API_KEY env variable not found')
}

if (!process.env.ETH_HOURS) {
    throw new Error('ETH_HOURS env variable not found')
}

const infuraApiKey = process.env.INFURA_API_KEY
const howOftenToRun = parseInt(process.env.ETH_HOURS)

const recurrenceRule = new schedule.RecurrenceRule()
recurrenceRule.hour = Array(Math.ceil(24 / howOftenToRun))
    .fill(1)
    .map((one, index) => index * howOftenToRun)
recurrenceRule.minute = 20

async function start() {
    const { eth, lastBlock } = createEth(infuraApiKey)

    const lastBlockNumber = await lastBlock()

    const blockRange = {
        start: lastBlockNumber - 10 * howOftenToRun,
        end: lastBlockNumber
    }

    eth(blockRange)
}

start()
