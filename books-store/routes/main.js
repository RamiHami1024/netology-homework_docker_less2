const express = require('express')
const router = express.Router()
const booksUploader = require('../middleware/booksUploader')
const {getData} = require('../middleware/getDataIncrement')
const fs = require('fs')
const {v4: uuid} = require('uuid')
const axios = require('axios')

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',
    })
})

router.post('/user/login', (req, res) => {
    const {mail} = req.body
    const newUser = new User(store.users.length + 1, mail)
    store.users.push(newUser)

    res.status(201).json(newUser)
})

router.get('/books', (req, res) => {
    res.render('books/index', {
        title: 'Главная',
        books: store.books
    })
})

router.get('/books/:id', async (req, res) => {
    const {id} = req.params
    const book = store.books.find(i => i.id === id)
    const data = await getData(id)

    res.render('books/view', {
        title: book.title,
        book: book,
        views: data.message
    })
})

router.get('/book/create', (req, res) => {
    res.render('books/create', {
        title: 'Загрузить книгу',
        book: {}
    })
})

router.post('/book/create', booksUploader.single('book'), (req, res) => {
    if (req.file) {
        const path = req.file.path
        const fileName = req.file.filename
        const book = req.body        
        const newBook = new Book(
            book.title,
            book.description,
            book.authors,
            book.favorite,
            book.fileCover,
            fileName,
            path
        )

        store.books.push(newBook)
        res.redirect('/books')

        return true
    }

    res.json({
        error: 'newBook'
    })
})

router.get('/books/:id/download', (req, res) => {
    const {id} = req.params
    const book = store.books.find(i => i.id === id)
    
    res.download(book.fileBook)
})

router.get('/books/update/:id', (req, res) => {
    const {id} = req.params
    const book = store.books.find(i => i.id === id)
    res.render('books/update', {
        title: 'Редактировать книгу',
        book: book
    })
})

router.post('/books/update/:id', booksUploader.single('book'), (req, res) => {
    const {id} = req.params
    const idx = store.books.findIndex(i => i.id === id)
    fs.unlinkSync(`./${store.books[idx].fileBook}`)

    store.books[idx] = {
        ...store.books[idx],
        ...req.body
    }
    
    res.redirect(`/books/${id}`)
})

router.delete('/books/:id', (req, res) => {
    const {id} = req.params

    store.books.forEach((item, index) => {
        if (item.id === id) {
            store.books.splice(index, 1)

            res.status(201).json('ok')
        } 

        res.status(404).json('Книга не найдена')
    })
})

class Book {
    constructor(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
        id = uuid()
    ) {
        this.id = id || ''
        this.title = title || ''
        this.description = description || ''
        this.authors = authors || ''
        this.favorite = favorite || ''
        this.fileCover = fileCover || ''
        this.fileName = fileName || ''
        this.fileBook = fileBook || ''
    }
}

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