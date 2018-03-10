const express = require('express')
const app = express()

const eth = require('./eth')

const blockRange = {
    start: 5110000,
    end: 5110240
}

eth(blockRange)

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
