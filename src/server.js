const express = require('express')
const fs = require('mz/fs')

import type { $Response } from 'express'

const logger = require('./log')

const app = express()

app.use('/graphs', express.static('graphs'))

app.get('/graphs', async (req, res: $Response) => {
    logger.log('/graphs request')
    const folders = await fs.readdir('./graphs')
    const listPromises = folders.map(async folder => {
        const subfolders = await fs.readdir(`./graphs/${folder}`)
        return { [folder]: subfolders }
    })
    const list = await Promise.all(listPromises)
    const response = list.reduce(
        (acc, curr) => ({
            ...acc,
            ...curr
        }),
        {}
    )
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(response))
})

app.listen(3000, () => {
    logger.log('Web server listening on port 3000')
    logger.log('Available APIs:')
    logger.log('/graphs')
    logger.log('/graphs/eth-x/y/{ graph.json , graph.net }')
    logger.log(
        '/graphs/eth-x/y/ngraph/{ labels.json , links.bin , meta.json , positions.bin }'
    )
})
