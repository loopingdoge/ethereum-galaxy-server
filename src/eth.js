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

type Range = {
    start: number,
    end: number
}

export type Node = {
    id: string
}

export type Link = {
    source: string,
    target: string,
    amount: number
}

export type Graph = {
    nodes: Node[],
    links: Link[]
}

module.exports = (infuraApiKey: string) => {
    const web3 = new Web3(
        Web3.givenProvider || `https://mainnet.infura.io/${infuraApiKey}:8546`
    )

    async function queryBlocks(blocksIndexes, cb) {
        const blocksPromises = blocksIndexes.map(x =>
            web3.eth
                .getBlock(x, true)
                .then(block => {
                    cb()
                    return block
                })
                .catch(err => {
                    cb()
                    logger.error(`Error retrieving getBlock(${x}): ${err}`)
                    return null
                })
        )

        const blocks = _.compact(await Promise.all(blocksPromises))

        const onlyTransactions = blocks.map(b => ({
            transactions: b.transactions
                .map(t => transformTransaction(t, web3.utils.fromWei))
                .filter(
                    t => t.amount > 0 && t.source !== null && t.target !== null
                )
        }))
        return onlyTransactions
    }

    function transformTransaction(transaction, convertWei) {
        return {
            source: transaction.from,
            target: transaction.to,
            amount: convertWei(transaction.value)
        }
    }

    async function eth(range: Range) {
        logger.log('Retrieving blocks...')
        const blocksIndexes = Array(range.end - range.start)
            .fill(1)
            .map((one, index) => range.start + one + (index - 1))

        const blocksIndexesAtATime = _.chunk(blocksIndexes, 240)

        const blockChunks = []
        for (let i = 0; i < blocksIndexesAtATime.length; i++) {
            const blocksIndexes = blocksIndexesAtATime[i]
            const progressBar = logger.progress(
                `Retrieving chunk ${i + 1} of ${
                    blocksIndexesAtATime.length
                }...`,
                blocksIndexes.length
            )
            const blocksChunk = await queryBlocks(blocksIndexes, () =>
                progressBar.tick()
            )

            blockChunks.push(blocksChunk)
        }
        const blocks = _.flatten(blockChunks)

        const cleanedBlocks = _.compact(blocks) // I don't think we need this

        logger.log('Processing transactions...')
        const transactions = _.flatten(
            cleanedBlocks
                .filter(block => block.transactions.length > 0)
                .map(block => block.transactions)
        )

        // const minifiedTransactions = transactions
        //     .map(transaction =>
        //         transformTransaction(transaction, web3.utils.fromWei)
        //     )
        //     .filter(t => t.amount > 0)

        logger.log('Processing nodes...')

        const sourceIds = transactions.map(t => t.source)
        const targetIds = transactions.map(t => t.target)
        const nodeIds = _.uniq(_.compact(_.union(sourceIds, targetIds)))

        const nodes = nodeIds.map(id => ({ id }))

        logger.log('Calculating layout...')

        const graph = { nodes, links: transactions }

        const ngraph = await calculateNgraphLayout(graph, () => {})

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

    async function lastBlock() {
        const syncResult = await web3.eth.isSyncing()
        if (syncResult) {
            return syncResult.currentBlock
        } else {
            const lastBlockNumber = await web3.eth.getBlockNumber()
            return lastBlockNumber
        }
    }

    return {
        eth,
        lastBlock
    }
}
