//=====================================
//         Dependencies
//=====================================
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose')
const methodOverride = require("method-override");
//Router
const logsController = require('./controllers/logs')

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

app.use(methodOverride("_method"));

//CSS
app.use(express.static(__dirname + '/public'));

//===========================================================
//        Controllers- Technically just middleware
//===========================================================
app.use('/logs', logsController);

//=====================================
//            Listener
//=====================================
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
