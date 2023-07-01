//=====================================
//         Dependencies
//=====================================
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose')
const methodOverride = require("method-override");
const Log = require('./models/logs.js')
const logSeed = require('./models/logSeed.js')

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
app.use(express.static(__dirname + '/public'))


//=====================================
//          Routes
//=====================================

//Seed Data============================
app.get('/logs/seed', async (req, res) => {
  try{
    await Log.deleteMany({});

    await Log.insertMany(logSeed);
    
    res.redirect('/logs')
  }catch (error) {
      console.log(error);
      res.status(500).send('Error seeding the database');
  }
})

//Index
app.get('/logs', (req, res) => {
  Log.find({})
  .then(allLogs => {
    res.render('index.ejs', {
      logs: allLogs
    })
  })
  .catch(error => {
    console.log(error)
  })
})

//New
app.get('/logs/new', (req, res) => {
  res.render('new.ejs')
})

//update
app.put('/logs/:id', async (req, res) => {
  try{
    const foundLog = await Log.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    res.redirect(`/logs/${req.params.id}`);
  }catch(err){
    console.log(err);
    res.status(500).send('An error occured in our update route');
  }
})

//Delete
app.delete('/logs/:id', async (req, res) =>{
  try{
    await Log.findByIdAndRemove(req.params.id);
    res.redirect('/logs');
  }catch (err){
    console.log(err);
    res.status(500).send('An error occured in our delete route');
  }
})


//Create
app.post('/logs', async (req, res) => {
  try{
    const createdLog = await Log.create(req.body);
    res.redirect('/logs');
  }catch (error) {
    console.error(error);
    res.status(500).send('An error occured in our create route')
  }
})

//Edit
app.get('/logs/:id/edit', async (req, res) => {
  try{
    const allLogs = await Log.findById(req.params.id);
    res.render('edit.ejs',{
      Logs: allLogs
    })
  }catch (err){
    console.log(err);
    res.status(500).send('An error occured in our edit route')
  }
})
  
//Show
app.get('/logs/:id',  async(req, res) =>{
  try{
    const foundLog = await Log.findById(req.params.id);
    res.render('show.ejs', {
      logs: foundLog,
    })
  }catch (error){
    console.log(error);
    res.status(500).send('An error occured in our show route')
  }
})

//=====================================
//            Listener
//=====================================
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
