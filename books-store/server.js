const express = require('express')
const api = require('./routes/main')
const mongoose = require('mongoose')

const app = express();
require('dotenv').config()

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL
const ADMIN = process.env.ADMIN
const ADMIN_PASS = process.env.ADMIN_PASS

async function start(PORT, dbUrl) {
    try {
        await mongoose.connect(dbUrl)
        console.log(mongoose.connection.readyState);
        app.listen(PORT)
    } catch(e) {
        throw Error(e)
    }
}


app.use('/', api)
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs')

start(PORT, DB_URL)
