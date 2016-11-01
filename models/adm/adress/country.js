var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String},
})

module.exports = mongoose.model('countries', schema);
