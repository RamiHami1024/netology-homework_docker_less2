const {Schema, model} = require('mongoose')

const booksShema = new Schema({
    title: {
        type: "string",
        required: true
    },
    description: {
        type: "string",
        default: ""
    },
    authors: {
        type: "string",
        default: ""
    },
    favorite: {
        type: "string",
        default: ""
    },
    fileBook: {
        type: "string",
        default: ""
    },
    fileName: {
        type: "string",
        default: ""
    },
})

module.exports = model('Books', booksShema)