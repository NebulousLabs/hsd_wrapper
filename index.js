const { NodeClient } = require('hs-client')
const express = require('express')

const host = process.env.HOST || 'localhost'
const port = Number(process.env.PORT) || 3100

const portal = process.env.PORTAL || 'https://siasky.net'

const hsdNetworkType = process.env.HSD_NETWORK || 'regtest'
const hsdHost = process.env.HSD_HOST || 'localhost'
const hsdPort = Number(process.env.HSD_PORT) || 12037
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
        console.log(`Received result: ${JSON.stringify(result)}`)
        let resolved
        if (result.result && result.result.records) {
            const records = result.result.records
            for (let i = 0; i < records.length; i++) {
                if (records[i].address) {
                    resolved = records[i].address
                    break
                }
            }
        }
        if (isValidSkylink(resolved)) {
            res.redirect(`${portal}/${resolved}`)
        } else {
            res.sendStatus(404)
        }
    } catch (e) {
        res.status(500).json(e).end()
    }
}

const SIA_LINK_RE = /^([a-zA-Z0-9-_]{46}.*)$/

// Checks if the given string is a valid Sia link.
function isValidSkylink(link) {
    if (!link || link.length === 0) {
        return false
    }
    return Boolean(link.match(SIA_LINK_RE))
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

    console.info(`API will look for HSD Server at ${hsdHost}:${hsdPort}, "${hsdNetworkType}" network.`)
    console.info(`Server listening at http://${host}:${port}`)
})
