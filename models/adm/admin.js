var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String},
	pass: { type: String },
    isAdmin: {type: String}
})

module.exports = mongoose.model('admins', schema);
