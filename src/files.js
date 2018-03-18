const jsonfile = require('jsonfile')
const fs = require('fs')

import type { Graph, Node, Link } from './eth'

function ensureDirExists(filepath: string) {
    const subdirsTokens = filepath.split('/')
    const subdirs = subdirsTokens.slice(1, subdirsTokens.length - 1)
    const directoriesFullPath = subdirs.map((_, i, a) =>
        a.slice(0, i + 1).join('/')
    )

    directoriesFullPath.forEach(directory => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }
    })
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
