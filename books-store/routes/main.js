const express = require('express')
const router = express.Router()
const booksUploader = require('../middleware/booksUploader')
const {getData} = require('../middleware/getDataIncrement')
const fs = require('fs')
const passport = require('passport')
const session = require('express-session')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodeParser = bodyParser.urlencoded({extended: false})

const db = require('../db')
const Books = require('../model/books')
const { debug } = require('console')
const LocalStrategy = require('passport-local').Strategy

const app = express()

const verify = (username, password, done) => {
    db.users.findByUsername(username, (err, user) => {
        if (err) {return done(err)}
        if (!user) {return done(null, false)}
        if (!db.users.verifyPassword(user, password)) {return done(null, false)}

        return done(null, user)
    })
}

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  await db.users.findById(id, (err, user) => {
    if (err) return cb(err)
    cb(null, user)
  })
})

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

app.use(session({ secret: 'SECRET'}));

app.use(passport.initialize())
app.use(passport.session())

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Главная'
    })
})

router.get('/users/login', (req, res) => {
    res.render('user/form', {title: 'Регистрация', book: {}})
})

router.post(
    '/users/login',
    (req, res) => {
        // passport.authenticate('local', {failureMessage: true}, function (err, user, info) {
        //     console.log(err, user, info)

        //     if (!user) {return res.redirect('/users/login')}
        // })(req, res)
        console.log(req.body)
        res.end()
        // res.redirect('/users/login')
    }
)

router.post(
    '/users/registry', 
    urlencodeParser,
    (req, res) => {
        const {username, password} = req.body

        try {
            db.users.createUser(username, password)
            res.redirect('/')
        } catch (error) {
            console.log(error)
            res.status(500).json({ code: 500, message: "Server error" })
        }
    })

router.get('/books', async (req, res) => {
    try {
        const books = await Books.find()

        res.render('books/index', {
        title: 'Главная',
        books: books
    })
    } catch(e) {
        res.status(500).json(e)
    }

    
})

router.get('/books/:id', async (req, res) => {
    const {id} = req.params
    const data = await getData(id)

    try {
        const book = await Books.findById(id)

        res.render(`books/view`, {
            title: book.title,
            book: book,
            views: data.message
        })
    } catch(e) {
        console.log(e)
        res.status(404).json({code: 404, message: 'Not found'})
    }

    // res.render('books/view', {
    //     title: book.title,
    //     book: book,
    //     views: data.message
    // })
})

router.get('/book/create', (req, res) => {
    res.render('books/create', {
        title: 'Загрузить книгу',
        book: {}
    })
})

router.post('/book/create', booksUploader.single('book'), async (req, res) => {
    const fileBook = req.file ? req.file.path : ''
    const fileName = req.file ? req.file.filename : fileBook.split('/')[1]
    console.log(req)
    const {title, description, authors, favorite} = req.body
    const newBook = new Books({
            title,
            description,
            authors,
            favorite,
            fileBook,
            fileName
        })

    try {
        await newBook.save()
        res.redirect(`/books`)
    } catch(e) {
        console.log(e)
        res.status(500).json({error: 500, message: 'Server error'})
    }
})

router.get('/books/:id/download', async (req, res) => {
    const {id} = req.params
    try {
        const fileName = await Books.findById(id)
        
        // res.json(fileName)
        if (fs.existsSync(fileName.fileBook)) {
            res.download(fileName.fileBook)
        }
    } catch(e) {
        res.status(500).json({error: 500, message: 'File not found'})
    }
})

router.get('/books/update/:id', async (req, res) => {
    const {id} = req.params
    
    try {
        const book = await Books.findById(id)
        
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }

        res.render('books/update', {
            title: 'Редактировать книгу',
            book: book
        })
    } catch(e) {
        console.log(e)
        res.status(404).json({code: 404, message: 'Not found'})
    }
})

router.post('/books/update/:id', booksUploader.single('book'), async (req, res) => {
    const {id} = req.params
    const fileBook = req.file ? req.file.path : ''
    const fileName = req.file ? req.file.filename : name.split('/')[1]
    const {
        title,
        description,
        authors,
        favorite,
    } = req.body
    try {
        const item = await Books.findById(id)
        
        if (fileBook || fileName) {
            fs.unlinkSync(`./${item.fileBook}`)
        }

        await Books.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            favorite,
            fileBook,
            fileName
        })
        res.redirect(`/books/${id}`)
    } catch(e) {
        console.log(e)
        res.status(404).json({code: 404, message: 'Not found'})
    }
})

router.post('/book/delete/:id', async (req, res) => {
    const {id} = req.params

    try {
        const fileName = await Books.findById(id)

        fs.unlinkSync(`./${fileName.fileBook}`)
        await Books.deleteOne({_id: id})
        res.redirect('/books')
    } catch(e) {
        console.log(e)
        res.status(404).json({code: 404, message: 'Not found'})
    }
})


class User {
    constructor(
        id,
        mail,
    ) {
        this.id = id
        this.mail = mail
    }
}


const store = {
    books: [
        
    ],
    users: [
        {
            id: 1,
            mail: 'root@root'
        }
    ]
}

module.exports = router