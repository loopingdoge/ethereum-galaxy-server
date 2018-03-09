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
            acc +
            `${nodesMap.get(curr.source)} ${nodesMap.get(curr.target)} ${
                curr.amount
            }\n`,
        ''
    )

    fs.writeFileSync(filepath, str)
}

module.exports = {
    dumpJSON,
    dumpPajek
}
