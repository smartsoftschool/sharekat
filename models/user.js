var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	email: { type: String, required: true },
	pass: String,
    verf: String,
	registerid: String,
	passresetid: String
})

module.exports = mongoose.model('users', schema);