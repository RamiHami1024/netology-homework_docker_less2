const express = require('express')
const api = require('./routes/main')

const app = express();

app
    .use('/', api)
    .use(express.json())
    .set('view engine', 'ejs')
    .listen(3000)