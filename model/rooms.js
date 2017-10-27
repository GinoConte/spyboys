'use strict';
//import dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//card schema:
//requires:
//1.
var RoomsSchema = new Schema({
  _id : Schema.Types.ObjectId,
  redScore: Number,
  blueScore: Number,

});

//export our module to use in server.js
module.exports = mongoose.model('Room', RoomsSchema);
