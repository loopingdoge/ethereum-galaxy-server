const express = require('express')

const createEth = require('./eth')

if (!process.env.INFURA_API_KEY) {
    throw new Error('INFURA_API_KEY env variable not found')
}

if (!process.env.ETH_HOURS) {
    throw new Error('ETH_HOURS env variable not found')
}

const infuraApiKey = process.env.INFURA_API_KEY
const howOftenToRun = parseInt(process.env.ETH_HOURS)

async function start() {
    const { scanBlocks, lastBlock } = createEth(infuraApiKey)

    const lastBlockNumber = await lastBlock()

    const blockRange = {
        start: lastBlockNumber - 10 * howOftenToRun,
        end: lastBlockNumber
    }

    scanBlocks(blockRange)
}

start()
