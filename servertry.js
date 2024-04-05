const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRouter = require('./routes/auth');
const resvRouter = require('./routes/resv');
const path = require('path');

//Models
const Account = require('./models/Account');
const Reservation = require('./models/Reservation');
const Lab = require('./models/Lab');
const TimeSlot = require('./models/TimeSlot');
const Seat = require('./models/Seat');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
// const Handlebars = require('handlebars');
// const { TopologyDescriptionChangedEvent } = require('mongodb');

app.set('view engine','hbs')

app.use(express.json()); 
app.use(express.urlencoded( {extended: true}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));

var hbs = require('hbs');
app.set('view engine','hbs');

const url = 'mongodb://localhost:27017/trying';
const dbName = 'trying';

//MongoDB Connect
mongoose.connect('mongodb://localhost:27017/trying')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

//app.set('views', path.join(__dirname, 'views'));
//app.use(express.static(__dirname))
//app.use(logger)
//app.use(express.static(path.join(__dirname, 'views')));
//app.use(express.static(path.join(__dirname, 'public')));

const labs = [
  { room: 'G301', timeName: "7:00-7:30", date: "05-01-2024", seats: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  { room: 'G301', timeName: "8:00-8:30", date: "05-01-2024", seats: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  { room: 'G301', timeName: "9:00-9:30", date: "05-01-2024", seats: [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "10:00-10:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "11:00-11:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "12:00-12:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "13:00-13:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "14:00-14:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "15:00-15:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "16:00-16:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "17:00-17:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G301', timeName: "18:00-18:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "7:00-7:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "8:00-8:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "9:00-9:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "10:00-10:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "11:00-11:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "12:00-12:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "13:00-13:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "14:00-14:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "15:00-15:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "16:00-16:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "17:00-17:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G302', timeName: "18:00-18:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "7:00-7:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "8:00-8:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "9:00-9:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "10:00-10:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "11:00-11:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "12:00-12:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "13:00-13:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "14:00-14:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "15:00-15:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "16:00-16:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "17:00-17:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
  // { room: 'G303', timeName: "18:00-18:30", seats: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },

];

//Populating Labs
// Lab.insertMany(labs)
//     .then(docs => {
//         console.log('Labs inserted successfully:', docs);
//         mongoose.connection.close(); // Close the MongoDB connection after insertion
//     })
//     .catch(err => console.error('Error inserting labs:', err));

app.get('/', function (req, res) {
  console.log('Index Page');
  res.render('index.hbs');
});

app.get('/register', (req, res) => {
  console.log('To Register');
  res.render('register.hbs');
});

app.get(`/home`, (req, res) => {
  console.log('To Home');
  res.render('home.hbs');
});

app.get('/labSelection', (req, res) => {
  console.log('To Lab Selection');
  res.render('labSelection.hbs');
});

app.get('/reserve', (req, res) => {
  console.log('To Reserve');
  res.render('reserve.hbs');
});

app.get('/setVisibility', (req, res) => {
  console.log('To Visibility');
  res.render('setVisibility.hbs');
});

app.get('/confirmation', (req, res) => {
  console.log('To Confirmation');
  res.render('confirmation.hbs');
});

app.get('/about', (req, res) => {
  console.log('To About');
  res.render('about.hbs');
});

app.get('/profile', async (req, res) => {
  try {
    const account = req.session.account;
    const reservations = await Reservation.find({ reservee: account._id }).populate('lab_id');
    console.log('Reservations:', reservations);
    res.render('profile.hbs', { account, reservations });
  } catch (error) {
    console.error('Error getting reservations:', error);
    res.status(500).send('Error getting reservations');
  }
});

app.post('/delete', async (req, res) => {
  try {
    const account = req.session.account;

    // Delete all reservations associated with the user
    const reservations = await Reservation.find({ reservee: account._id });
    for (const reservation of reservations) {
      // Update the seat availability for the lab
      const lab = await Lab.findById(reservation.lab_id);
      for (const seat of reservation.seats) {
        lab.seats[seat-1] = 0; // Set the reserved seat to available
      }
      await lab.save();
      await Reservation.deleteOne({ _id: reservation._id }); // Delete the reservation
    }

    // Delete the user's account
    await Account.deleteOne({ _id: account._id });

    // Clear the session and redirect to the login page
    req.session.destroy();
    res.render('index.hbs');
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
});

app.use('/auth', authRouter)
app.use('/resv', resvRouter)
app.use(express.static(path.join(__dirname, 'views')));

//Server
var server = app.listen(3000, function () {
    console.log('Node server is running..');
});
