const express = require('express')
const router = express.Router()
const fs = require('fs')
const redis = require('redis')

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost'
const client = redis.createClient({url: REDIS_URL});

(async () => await client.connect())()

router.get('/counter/:id', async (req, res) => {
    const {id} = req.params

    try {
        const cnt = await client.get(id)
        res.json({message: cnt})
    } catch(e) {
        res.statusCode(500).json({err_msg: 'Error ' + e})
    }
})

router.post('/counter/:id/incr', async (req, res) => {
    const {id} = req.params
    try {
        const cnt = await client.incr(id)
        res.json({message: cnt})
    } catch(e) {
        res.statusCode(500).json({err_msg: 'Error ' + e})
    }

})

module.exports = router