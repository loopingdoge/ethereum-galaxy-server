const jsonfile = require('jsonfile')
const fs = require('fs')

import type { Graph, Node, Link } from './eth'

function ensureDirExists(filepath: string) {
    const directory = filepath.substring(0, filepath.lastIndexOf('/') + 1)

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
    }
}

function dumpJSON(filepath: string, graph: Graph) {
    ensureDirExists(filepath)

    jsonfile.writeFile(filepath, graph, { spaces: 2 }, err => {
        console.error(err)
    })
}

function dumpPajek(filepath: string, { nodes, links }: Graph) {
    ensureDirExists(filepath)

    const nodesMap: Map<string, number> = new Map()
    let str = ''

    str += `*Vertices ${nodes.length}\n`
    str += nodes.reduce((acc, curr, index) => {
        nodesMap.set(curr.id, index + 1)
        return acc + `${index + 1} "${curr.id}"\n`
    }, '')
    str += '*arcs\n'
    str += links.reduce((acc, curr, index) => {
        const source = nodesMap.get(curr.source)
        const target = nodesMap.get(curr.target)
        if (!source || !target) {
            throw new Error('Source or target null')
        }
        return acc + `${source} ${target} ${curr.amount}\n`
    }, '')

    fs.writeFileSync(filepath, str)
}

module.exports = {
    dumpJSON,
    dumpPajek,
    ensureDirExists
}
