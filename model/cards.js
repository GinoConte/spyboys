'use strict';
//import dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//card schema:
//requires:
//1. word String
//2. theme String
//3. vote (state based)
var CardsSchema = new Schema({
  word: String,
  theme: String
});

//export our module to use in server.js
module.exports = mongoose.model('Card', CardsSchema);
