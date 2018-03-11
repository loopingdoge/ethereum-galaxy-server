const createGraph = require('ngraph.graph')
const createLayout = require('ngraph.offline.layout')

const { ngraphBasePath } = require('./config')

function calculateLayout(graph, onTick) {
    return new Promise((resolve, _reject) => {
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

        resolve(g)
    })
}

module.exports = calculateLayout
