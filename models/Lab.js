const mongoose = require('mongoose')

const Lab = new mongoose.Schema({
    room: String,
    timeName: String,
    date: String,
    seats: [Number]
});

module.exports = mongoose.model('Lab', Lab)