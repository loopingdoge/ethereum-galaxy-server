const express = require('express')
const app = express()
const Web3 = require('web3')
const _ = require('lodash')
const jsonfile = require('jsonfile')
const fs = require('fs')

console.log('Initializing...')
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')

const blockRange = {
    start: 5110000,
    end: 5110240
}

async function queryBlocks(range) {
    const blocksPromises = Array(range.end - range.start)
        .fill(1)
        .map((one, index) => range.start + one + (index - 1))
        .map(x =>
            web3.eth.getBlock(x, true).catch(err => {
                // console.log(`Error in getBlock(${x}):`, err)
                return null
            })
        )

    const blocks = await Promise.all(blocksPromises)
    return blocks
}

function transformTransaction(transaction, convertWei) {
    return {
        source: transaction.from,
        target: transaction.to,
        amount: convertWei(transaction.value)
    }
}

function ensureDirExists(filepath) {
    const directory = filepath.substring(0, filepath.lastIndexOf('/') + 1)

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
    }
}

function dumpJSON(filepath, nodes, transactions) {
    ensureDirExists(filepath)

    const obj = {
        nodes,
        links: transactions
    }

    jsonfile.writeFile(filepath, obj, { spaces: 2 }, err => {
        console.error(err)
    })
}

function dumpPajek(filepath, nodes, transaction) {
    ensureDirExists(filepath)

    const nodesMap = new Map()
    let str = ''

    str += `*Vertices ${nodes.length}\n`
    str += nodes.reduce((acc, curr, index) => {
        nodesMap.set(curr.id, index + 1)
        return acc + `${index + 1} "${curr.id}"\n`
    }, '')
    str += '*arcs\n'
    str += transaction.reduce(
        (acc, curr, index) =>
            acc + `${nodesMap.get(curr.source)} ${nodesMap.get(curr.target)}\n`
    )

    fs.writeFileSync(filepath, str)
}

async function main() {
    console.log('Retrieving blocks...')
    const blocks = await queryBlocks(blockRange)
    const cleanedBlocks = _.compact(blocks)

    console.log('Processing transactions...')
    const transactions = _.flatten(
        cleanedBlocks
            .filter(block => block.transactions.length > 0)
            .map(block => block.transactions)
    )

    const minifiedTransactions = transactions
        .map(transaction =>
            transformTransaction(transaction, web3.utils.fromWei)
        )
        .filter(t => t.amount > 0)

    console.log('Transactions:')
    console.log(minifiedTransactions)

    console.log('Processing nodes...')
    const sourceIds = minifiedTransactions.map(t => t.source)
    const targetIds = minifiedTransactions.map(t => t.target)
    const nodeIds = _.uniq(_.compact(_.union(sourceIds, targetIds)))

    // const nodeBalancesPromises = nodeIds.map(id =>
    //     web3.eth.getBalance(id).catch(err => {
    //         // console.log(`Error in getBalance(${id}):`, err)
    //         return null
    //     })
    // )

    // const nodeBalances = await Promise.all(nodeBalancesPromises)
    // const cleanNodeBalances = _.compact(nodeBalances)
    // const nodeBalancesInEther = cleanNodeBalances.map(b =>
    //     web3.utils.fromWei(b)
    // )

    // const nodes = _.zipWith(nodeIds, nodeBalancesInEther, (id, balance) => ({
    //     id,
    //     balance
    // }))

    const nodes = nodeIds.map(id => ({ id }))

    console.log('Nodes: ')
    console.log(nodes)

    dumpJSON('json/node.json', nodes, minifiedTransactions)
    dumpPajek('json/node.net', nodes, minifiedTransactions)
}

main()

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
