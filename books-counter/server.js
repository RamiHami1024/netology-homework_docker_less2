const express = require('express')
const router = require('./routes/router')
const app = express()
require('dotenv').config()

const PORT = process.env.COUNTER_PORT || 3002

app
    .use('/', router)
    .use(express.json())
    .listen(PORT)