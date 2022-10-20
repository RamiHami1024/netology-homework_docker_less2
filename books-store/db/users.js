const Users = require('../model/users')

exports.findById = async function (id, cb) {
    try {
        const user = await Users.findById(id)

        Object.keys(user).length ?
            cb(null, user) :
            cb(null, null)
    } catch (error) {
        throw Error(error)
    }
}

exports.findByUsername = async function (username, cb) {
    try {
        const user = await Users.find({ userName: username })

        Object.keys(user).length ? 
            cb(null, user) :
            cb(null, null)
    } catch (error) {
        throw Error(error)
    }
}

exports.verifyPassword = (user, password) => {
    return user[0].password === password
}

exports.createUser = async function (username, password) {
    const newUser = new Users({ username, password })

    try {
        await newUser.save()        
    } catch (error) {
        throw Error(error)
    }
}