const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const Lab = require('../models/Lab');
const Reservation = require('../models/Reservation');

  router.post('/getAvailableSeats', async (req, res) => {
    try {
      const { lab, date, time } = req.body;
  
      // Find the lab based on the room, date, and time
      const selectedLab = await Lab.findOne({ room: lab, timeName: time });
  
      // Prepare the seat data with availability information
      const seatData = selectedLab.seats.map((seat, index) => ({
        seatNumber: index + 1,
        isAvailable: seat === 0, // Seat is available if the value is 0
      }));
  
      res.json(seatData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/createReservation', async (req, res) => {
    try {
      const { lab, date, time, selectedSeats, visibility } = req.body;
      const accountId = req.session.account;
  
      // Find the lab based on the selected room, date, and time
      const selectedLab = await Lab.findOne({ room: lab, timeName: time });
  
      // Update the seats array in the Lab document
      selectedSeats.forEach((seatNumber) => {
        selectedLab.seats[seatNumber - 1] = 1; // Set the seat value to 1 (booked)
      });
  
      // Create a new reservation
      const reservation = new Reservation({
        reservee: accountId,
        lab_id: selectedLab._id,
        reservation_date: date,
        visibility: visibility,
        seats: selectedSeats,
      });
  
      // Save the reservation and update the Lab document
      await Promise.all([
        reservation.save(),
        selectedLab.save(), // Save the updated Lab document
      ]);
  
      res.json({ message: 'Reservation created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;