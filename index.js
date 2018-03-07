const express = require('express')
const app = express()
const Web3 = require('web3')

let web3 = new Web3()

console.log("Initializing web3...")
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
}

const latest = web3.eth.getBlock("latest", true)
console.log("Latest block:")
console.log(latest)

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))