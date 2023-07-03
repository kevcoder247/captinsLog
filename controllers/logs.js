//=======================================================
//               Require dependencies
//=======================================================
const express = require('express');
const Log = require('../models/log.js')
const logSeed = require('../models/logSeed.js')
//initialize the router object
const router = express.Router();


//define router/controller code
//=======================================================
//                      Routes
//=======================================================
//=======================================================
//                      Seed Data 
//=======================================================
router.get('/seed', async (req, res) => {
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
router.get('/', (req, res) => {
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
router.get('/new', (req, res) => {
  res.render('new.ejs')
})

//update
router.put('/:id', async (req, res) => {
  try{
    const foundLog = await Log.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    res.redirect(`/logs/${req.params.id}`);
  }catch(err){
    console.log(err);
    res.status(500).send('An error occured in our update route');
  }
})

//Delete
router.delete('/:id', async (req, res) =>{
  try{
    await Log.findByIdAndRemove(req.params.id);
    res.redirect('/logs');
  }catch (err){
    console.log(err);
    res.status(500).send('An error occured in our delete route');
  }
})


//Create
router.post('/', async (req, res) => {
  try{
    const createdLog = await Log.create(req.body);
    res.redirect('/logs');
  }catch (error) {
    console.error(error);
    res.status(500).send('An error occured in our create route')
  }
})

//Edit
router.get('/:id/edit', async (req, res) => {
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
router.get('/:id',  async(req, res) =>{
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


module.exports = router;