var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String},
    countryId: {type: String}
})

module.exports = mongoose.model('states', schema);
