'use strict';
//import dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//card schema:
//requires:
//1. word String
//2. theme String
//3. vote (state based)
var ClueboysSchema = new Schema({
  _id : Schema.Types.ObjectId,
  _parentRoom: Schema.Types.ObjectId,
  team: String,
  currentClue: String,
  pastClues: [String],
});

//export our module to use in server.js
module.exports = mongoose.model('Clueboy', ClueboysSchema);
