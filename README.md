# Ethereum Galaxy - Server

Node.js server for [Ethereum Galaxy](https://github.com/loopingdoge/ethereum-galaxy), currently live [here](https://loopingdoge.github.io/ethereum-galaxy).

These scripts retrieves the transactions from the ethereum blockchain and save it as a graph, where:

*   Nodes => addresses
*   Edges => transactions

The supported output formats are:

*   [Pajek](https://gephi.org/users/supported-graph-formats/pajek-net-format/)
*   [ngraph](https://github.com/anvaka/ngraph)
*   A custom JSON, example:

```
{
    "nodes": [
        { "id": "0x390dE26d772D2e2005C6d1d24afC902bae37a4bB" },
        { "id": "0x2E26035B04213530DeEeA6a3874D0f4143BcE939" }
    ],
    "links": [
        {
            "source": "0x390dE26d772D2e2005C6d1d24afC902bae37a4bB",
            "target": "0x2E26035B04213530DeEeA6a3874D0f4143BcE939",
            "amount": "0.14426006"
        }
    ]
}
```

The outputs will be inside the `graphs` folder having this structure:

```
graphs
├───eth-1                       # The graph of 1 hour of transactions
│   └───17                      # The hour when the graph was generated
|       ├───graph.json
|       ├───graph.net
│       └───ngraph
|           ├───positions.bin
|           ├───links.bin
|           ├───labels.json
|           └───meta.json
└───eth-6                       # The graph of 6 hours of transactions
```

The web server will serve the files inside the `graph` folder, with the following API:

`/graphs` returns the available graphs.

`/graphs/eth-X/Y/graph.*` returns the request graph.

## Requirements

*   Node.js
*   An [Infura](https://infura.io/) API key
*   [Pm2](http://pm2.keymetrics.io/)

Clone the repository and install the dependencies:

```
$ git clone https://github.com/loopingdoge/ethereum-galaxy-server
$ npm install
```

Build the src files:

```
$ npm run flow:build
```

Set the Infura API key:

```
$ export INFURA_API_KEY=<Your key>
```

## Usage

The server is meant to be ran using `pm2`.

```
$ pm2 start ecosystem.config.js
```

will start the server instances configured inside `ecosystem.config.js`.

By default the web server will serve on port `8888`.

### No 3D layout

By default the server will calculate a 3D layout of the graph, but this is a very CPU intensive operation. If you don't need this data you can use the `src/start-no-layout.js` script.

Running:

```
$ node ./build/start-no-layout.js --api <INFURA_API_KEY> --start 500 --end 600
```

will generate the graph of the blocks in the range of 500-600.
