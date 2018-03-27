const createGraph = require('ngraph.graph')
const createLayout = require('ngraph.offline.layout')

import type { Graph } from './eth'

async function calculateLayout(graph: Graph, outDirPath: string) {
    const g = createGraph()

    graph.links.forEach(l => {
        g.addLink(l.source, l.target)
    })

    const layout = createLayout(g, {
        iterations: 500,
        saveEach: 500,
        outDir: outDirPath
    })

    layout.run()

    return g
}

module.exports = calculateLayout
