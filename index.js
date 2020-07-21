const { NodeClient } = require('hs-client')
const express = require('express')

const host = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3100

const hsdNetworkType = process.env.HSD_NETWORK || 'regtest'
const hsdHost = process.env.HSD_HOST || 'localhost'
const hsdPort = process.env.HSD_PORT || 12037
const hsdApiKey = process.env.HSD_API_KEY || 'foo'

const clientOptions = {
    network: hsdNetworkType,
    host: hsdHost,
    port: hsdPort,
    apiKey: hsdApiKey
}
const client = new NodeClient(clientOptions)

const hsdHandler = async (req, res) => {
    try {
        const result = await client.execute('getnameresource', [req.params.name])
        res.json({ result })
    } catch (e) {
        res.status(500).json(e).end()
    }
}

const server = express()

server.get('/hsd/:name', hsdHandler)

// Handle all other routes.
server.use(function (req, res, next) {
    if (!req.route)
        return next(new Error('404'))
    next()
})

server.listen(port, host, (error) => {
    if (error) throw error

    console.info(`Server listening at http://${host}:${port} (NODE_ENV: ${process.env.NODE_ENV})`)
})
