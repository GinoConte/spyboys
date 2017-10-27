//server.js
'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Card = require('../model/cards');
var Room = require('../model/rooms');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

//mongodb config
var mongoDB = 'mongodb://admin:admin@ds229415.mlab.com:29415/spyboys';
mongoose.connect(mongoDB, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//configure the API to use bodyParser and look for JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//initialize api
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//first endpoint perform operations on Cards
//GET: retrieve all cards in the database
//POST: create a new card with a word string and a theme string
router.route('/cards')
  .get(function(req, res) {
    Card.find(function(err, cards) {
      if (err)
        res.send(err);
      res.json(cards)
    });
  })
  .post(function(req, res) {
    var card = new Card(); //create new card
    card.word = req.body.word;
    card.theme = req.body.theme;

    card.save(function(err) {//save card to db
      if (err)
        res.send(err)
      res.json({message: "New card \"" + card.word + "\" has been added."})
    });
  });

//create a new room
router.route('/room')
  .get(function(req, res) {//retrieve all rooms
    Room.find(function(err, rooms) {
      if (err)
        res.send(err);
      res.json(rooms)
    });
  })
  .post(function(req, res) {
    var room = new Room(); //create new room
    room._id = new mongoose.Types.ObjectId(),
    room.redScore = 1;
    room.blueScore = 2;

    room.save(function(err) {
      if (err)
        res.send(err)
      res.json({message: "New room has been created at token: " + room._id,
                roomid: room._id})
    });
  });





//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
