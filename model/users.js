'use strict';
//import dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//card schema:
//requires:
//1.
var UsersSchema = new Schema({
  _id : Schema.Types.ObjectId,
  name: String,
  currentRoom: Schema.Types.ObjectId,

});

//export our module to use in server.js
module.exports = mongoose.model('User', UsersSchema);
