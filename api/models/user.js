'user strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const Schema = mongoose.Schema
const UserSchema = Schema({
    email: { type: String, unique: true, lowercase: true },
    displayName: String,
    avatar: String,
    password: { type: String, select: false, },
    signupDate: { type: Date, default: Date.now() },
    lastLogin: Date
})

// This function is executed before the model is stored in the database

UserSchema.pre('save', next => {
    const user = this
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        });
    });
})

module.exports = mongoose.model('User', UserSchema)
