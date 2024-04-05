const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    accountType: String,
});


module.exports = mongoose.model('Account', accountSchema)