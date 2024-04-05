const mongoose = require('mongoose')

const Reservation = new mongoose.Schema({
    reservee: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    lab_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
    reservation_date: String,
    visibility: {type: String, enum: ['Anonymous', 'Visible'], default: 'Visible'},
    seats: [Number]
});

module.exports = mongoose.model('Reservation', Reservation)