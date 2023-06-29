//=====================================
//         Dependencies
//=====================================
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose')
const Log = require('./models/logs.js')

//=====================================
//        Database Connection
//=====================================
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

//=====================================
//      MIDDLEWARE & BODY PARSER
//=====================================
app.use(express.urlencoded({ extended: true }));


//=====================================
//          Routes
//=====================================

//Index
app.get('/logs', (req, res) => {
  res.send(`<h1>Hello</h1>`)
})

//New
app.get('/logs/new', (req, res) => {
  res.render('new.ejs')
})

//Create
app.post('/logs', (req, res) => {
  Book.create(req.body, (error, createdBook) => {
		res.send(createdBook);
	});
})
//=====================================
//            Listener
//=====================================
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
