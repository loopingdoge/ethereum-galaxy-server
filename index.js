const express = require('express')
const app = express()
const Web3 = require('web3')
const _ = require('lodash')

console.log('Initializing...')
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')

const blockRange = {
    start: 400000,
    end: 401000
}

async function queryBlocks(range) {
    const blocksPromises = Array(range.end - range.start)
        .fill(1)
        .map((one, index) => range.start + one + (index - 1))
        .map(x => web3.eth.getBlock(x, true))

    const blocks = await Promise.all(blocksPromises).catch(err => {
        console.log(err)
        return null
    })
    return blocks
}

function transformTransaction(transaction, convertWei) {
    return {
        source: transaction.from,
        target: transaction.to,
        amount: convertWei(transaction.value)
    }
}

async function main() {
    console.log('Retrieving blocks...')
    const blocks = await queryBlocks(blockRange)

    console.log('Processing transactions...')
    const transactions = _.flatten(
        blocks
            .filter(block => block.transactions.length > 0)
            .map(block => block.transactions)
    )

    const transformedTransactions = transactions.map(transaction =>
        transformTransaction(transaction, web3.utils.fromWei)
    )

    console.log('Transactions:')
    console.log(transformedTransactions)
}

main()
// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
