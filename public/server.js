//server.js
'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Card = require('../model/cards');
var Room = require('../model/rooms');
var Clueboy = require('../model/clueboys');

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

var ricknmorty = ['Rick', 'Morty', 'Time', 'Dimension', 'Portal', 'Plumbus', 'Neutrino', 'Meeseeks',
'Robot', 'Ants', 'Vindicator', 'Beth', 'Jerry', 'Summer', 'Birdperson', 'Citadel',
'C-137', 'Schmeckle', 'Ship', 'Space', 'Pickle', 'Tiny', 'Schwifty', 'Poopy', 'Flurbo',
'Gwendolyn', 'Smidgen', 'Shrink', 'Ray', 'Genuis', 'Quinton', 'Horse', '*Burp*'];

var simpsons = ['Homer', 'Bart', 'Lisa', 'Marge', 'Abe', 'Snowball', 'Apu', 'Wiggum', 'Lenny', 'Nuclear',
'Skinner', 'Springfield', 'Maggie', 'Steamed Hams', 'Flanders', 'Scorpio', 'Winnipeg', 'Moe',
'Duff', 'Tavern', 'Bonestorm', 'Milhouse', 'Treehouse', 'Shorts', 'D\'oh', 'Krusty']

var australia = ['Straya', 'Grog', 'Goon', 'Oath', 'Stubby', 'Abbott', 'Kevin', 'Ute', 'Roo', 'Platypus', 'Sydney',
'Melbourne', 'S\'truth', 'Grouse', 'Wallaby', 'Mate', 'Magpie', 'Spewwin', 'Budgie']

var food = ['Bagel', 'Doughnut', 'Cake', 'Cream', 'Milk', 'Cheese', 'Bread', 'Scotch', 'Jack', 'Coffee', 'Pasta',
            'Pizza', 'Potato', 'Steak', 'Pig']

var concepts = ['B Emoji', 'Sad', 'Rude', 'Prime', 'Help']

var bigguy = ['4 U', 'I\'m CIA']


function generate25WordArray(theme) {
  let possibleWords = ricknmorty.concat(australia);

  let wordList = [];
  while (wordList.length < 25) {
    var selectedWord = possibleWords[Math.floor(Math.random()*possibleWords.length)];
    if (wordList.indexOf(selectedWord) > -1) {
      continue;
    } else {
      wordList.push(selectedWord);
    }
    //console.log("WORDS", wordList);
  }
  return wordList;
}


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

//PUT -- update the state of a card
router.route('/cards/:cardid')
		.put(function(req, res) {
			Card.findById(req.params.cardid, function(err, card) {
    		if (err)
	    		res.send(err);
      	(req.body.state) ? card.state = req.body.state : null;
      	card.save(function(err) {
        	if (err)
        	  res.send(err);
        	res.json({ message: 'Card state updated' });

      	});
    	});
})

//PUT -- update the state of a clueboy
router.route('/clueboys/:clueboyid')
.put(function(req, res) {
  Clueboy.findById(req.params.clueboyid, function(err, clueboy) {
    if (err)
      res.send(err);
    (req.body.currentClue) ? clueboy.currentClue = req.body.currentClue : null;
    (req.body.clueSubmitted) ? clueboy.clueSubmitted = req.body.clueSubmitted : null;
    (req.body.decrease) ? clueboy.cardsRemaining = clueboy.cardsRemaining - 1 : null;
    (req.body.decrease) ? clueboy.guessesRemaining = clueboy.guessesRemaining - 1 : null;
    (req.body.guessesRemaining) ? clueboy.guessesRemaining = req.body.guessesRemaining : null;
    (req.body.currentGuessNumber) ? clueboy.currentGuessNumber = req.body.currentGuessNumber : null;
    clueboy.save(function(err) {
      if (err)
        res.send(err);
      console.log('Clueboy clue has been updated: '+clueboy.currentClue);
      res.json({ message: 'Clueboy state updated' });

    });
  });
})

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

    let coinFlip = Math.floor(Math.random() * 2) + 1; //pick starting team!
    if (coinFlip == 1) {
      room.teamTurn = 'red';
    } else {
      room.teamTurn = 'blue';
    }

    var redLeft;
    var blueLeft;
    //create game board with 25 cards
    if (room.teamTurn === 'red') {
      redLeft = 9;
      blueLeft = 8;
    } else {
      redLeft = 8;
      blueLeft = 9;
    }
    var cbrl = redLeft;
    var cbbl = blueLeft;
    let blackLeft = 1;
    let greenLeft = 25 - redLeft - blueLeft - blackLeft;

    var words = generate25WordArray("Nothin yet");

    for (let i = 0; i < 25 ; i++) {
      //create cards
      let currCard = new Card({
                _id: new mongoose.Types.ObjectId(),
        _parentRoom: room._id,
      //         word: "Bepsi",
              theme: "Toonz",
              state: "none",
      });

      currCard.word = words[i];
      if (australia.includes(currCard.word)) {
        currCard.theme = 'Australia';
      } else {
        currCard.theme = 'Rick and Morty';
      }


      //console.log (currCard);

      //pick a colour for the card
      let possibleCardTypes = [];
      blackLeft > 0 ? possibleCardTypes.push("black") : null;
      for (let j = 0; j < redLeft; j++) {
        possibleCardTypes.push("red")
      } //add for better randomness, probability reflects how many there are left
      for (let j = 0; j < greenLeft; j++) {
        possibleCardTypes.push("green")
      }
      for (let j = 0; j < blueLeft; j++) {
        possibleCardTypes.push("blue")
      }
      var selectedCardType = possibleCardTypes[Math.floor(Math.random()*possibleCardTypes.length)];
      //console.log("Selected: ", selectedCardType);

      //reduce count of selected type
      if (selectedCardType === 'red')
        redLeft--;
      if (selectedCardType === 'black')
        blackLeft--;
      if (selectedCardType === 'blue')
        blueLeft--;
      if (selectedCardType === 'green')
        greenLeft--;

      currCard.colour = selectedCardType;
      currCard.save(function (err) {
        if (err)
          res.send(err);
      })
    }

    //create two clueboys
    let redClueboy = new Clueboy({
      _id: new mongoose.Types.ObjectId(),
      _parentRoom: room._id,
      team: 'red',
      currentClue: '',
      pastClues: [],
      clueSubmitted: false,
      cardsRemaining: cbrl,
      guessesRemaining: 0,
      currentGuessNumber: 0,
    });
    redClueboy.save(function (err) {
      if (err)
        res.send(err)
    });

    let bluesCluesboy = new Clueboy({
      _id: new mongoose.Types.ObjectId(),
      _parentRoom: room._id,
      team: 'blue',
      currentClue: '',
      pastClues: [],
      clueSubmitted: false,
      cardsRemaining: cbbl,
      guessesRemaining: 0,
      currentGuessNumber: 0,
    });
    bluesCluesboy.save(function (err) {
      if (err)
        res.send(err)
    });

    room.save(function(err) {
      if (err)
        res.send(err)
      console.log("Room created: " + room._id);
      res.json({message: "New room has been created at token: " + room._id,
                roomid: room._id});
    });
});


//return the room found via an id
router.route('/room/:roomid')
  .get(function(req, res) {
    Room.findById(req.params.roomid, function(err, room) {
  		if (err)
  			res.send(err);
  		res.json(room)
    });
  })
  .put(function(req, res) {
    Room.findById(req.params.roomid, function(err, room) {
      if (err)
        res.send(err);
      (req.body.teamTurn) ? room.teamTurn = req.body.teamTurn : null;
      room.save(function(err) {
        if (err)
          res.send(err);
        //console.log('Plot information has been updated');
        res.json({ message: 'Room team turn updated' });

      });
    });
})

//return the cards generated by a room
router.route('/room/:roomid/fetchcards')
  .get(function(req, res) {
    Card.find( { _parentRoom: req.params.roomid}, function(err, cards) {
  		if (err)
  			res.send(err);
  		res.json(cards)//return all the cards found given a parent room id
    });
  });

//return the clueboys generated by a room id
router.route('/room/:roomid/fetchclueboys')
  .get(function(req, res) {
    Clueboy.find( { _parentRoom: req.params.roomid}, function(err, clueboys) {
  		if (err)
  			res.send(err);
  		res.json(clueboys)
    });
  });





//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
