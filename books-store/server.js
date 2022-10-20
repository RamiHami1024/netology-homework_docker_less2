const express = require('express')
const api = require('./routes/main')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const app = express();
require('dotenv').config()
const LocalStrategy = require('passport-local').Strategy
const db = require('./db')

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

const verify = (username, password, done) => {
    db.users.findByUsername(username, (err, user) => {
        if (err) {return done(err)}
        if (!user) {return done(null, false)}
        if (!db.users.verifyPassword(user, password)) {console.log('here'); return done(null, false)}

        return done(null, user)
    })
}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.serializeUser((user, cb) => {
    console.log(user[0].id)
    cb(null, user[0].id)
})

passport.deserializeUser(async (id, cb) => {
  await db.users.findById(id, (err, user) => {
    console.log(user)
    if (err) return cb(err)
    cb(null, user)
  })
})

passport.use('local', new LocalStrategy(options, verify))

app.use(express.urlencoded({extended: false}));
app.use(session({ secret: 'SECRET'}));
app.use(passport.initialize())
app.use(passport.session())
app.use('/', api)
app.set('view engine', 'ejs')

start(PORT, DB_URL)
