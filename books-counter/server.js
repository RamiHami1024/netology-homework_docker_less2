const express = require('express')
const router = require('./routes/router')
const app = express()

app
    .use('/', router)
    .use(express.json())
    .listen(3002)