const express = require('express')
const app = express()
const Web3 = require('web3')

console.log("Initializing web3...")
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
console.log("Initialized\n")

console.log("Latest block: ")
web3.eth.getBlock("latest").then(console.log);

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))