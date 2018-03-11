const Web3 = require('web3')
const _ = require('lodash')
const saveGraph = require('ngraph.tobinary')

const {
    baseFilename,
    jsonFilename,
    pajekFilename,
    ngraphBasePath
} = require('./config')
const { dumpJSON, dumpPajek } = require('./files')
const logger = require('./log')
const calculateLayout = require('./layout')
const calculateNgraphLayout = require('./ngraph-layout')

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')

async function queryBlocks(range) {
    const blocksPromises = Array(range.end - range.start)
        .fill(1)
        .map((one, index) => range.start + one + (index - 1))
        .map(x =>
            web3.eth.getBlock(x, true).catch(err => {
                logger.error(`Error retrieving getBlock(${x}): ${err}`)
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

async function eth(range) {
    logger.log('Retrieving blocks...')
    const blocks = await queryBlocks(range)
    const cleanedBlocks = _.compact(blocks)

    logger.log('Processing transactions...')
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

    logger.log('Processing nodes...')

    const sourceIds = minifiedTransactions.map(t => t.source)
    const targetIds = minifiedTransactions.map(t => t.target)
    const nodeIds = _.uniq(_.compact(_.union(sourceIds, targetIds)))

    const nodes = nodeIds.map(id => ({ id }))

    logger.log('Calculating layout...')

    const graph = { nodes, links: minifiedTransactions }

    const ngraph = await calculateNgraphLayout(graph)

    saveGraph(ngraph, {
        outDir: ngraphBasePath,
        labels: `labels.json`,
        meta: `meta.json`,
        links: `links.bin`
    })

    // const progressBar = logger.progress('Calculating layout', 300)
    // const graph = await calculateLayout(
    //     { nodes, links: minifiedTransactions },
    //     () => progressBar.tick()
    // )

    logger.log('Exporting the graph to JSON...')

    dumpJSON(jsonFilename, graph)

    logger.log('Exporting the graph to Pajek...')

    dumpPajek(pajekFilename, graph)

    logger.log('Finished, cya')
}

module.exports = eth
