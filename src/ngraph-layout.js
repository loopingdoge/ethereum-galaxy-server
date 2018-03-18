const createGraph = require('ngraph.graph')
const createLayout = require('ngraph.offline.layout')

const { ngraphBasePath } = require('./config')

import type { Graph } from './eth'

async function calculateLayout(graph: Graph, onTick: () => any) {
    const g = createGraph()

    graph.links.forEach(l => {
        g.addLink(l.source, l.target)
    })

    const layout = createLayout(g, {
        iterations: 500,
        saveEach: 500,
        outDir: ngraphBasePath
    })

    layout.run()

    return g
}

module.exports = calculateLayout
