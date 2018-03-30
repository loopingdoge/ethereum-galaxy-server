const fs = require('fs')

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

module.exports = {
    ensureDirExists
}
