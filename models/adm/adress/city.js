var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String},
    stateId: {type: String}
})

module.exports = mongoose.model('cities', schema);
