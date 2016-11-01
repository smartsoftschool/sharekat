var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	email: { type: String, required: true },
	pass: { type: String, required: true },
    verf: String,
	gender:{
        type: String,
        uppercase: true,
        enum: ['M', 'F'],
		required: true
    },
	birthdate:{ type: String, required: true },

	address: {		
	country:{type: String},
	state:{type: String},
	city:{type: String},
	zone:{type: String}
	},
	
          
      

	number:{ type: String },
	registerid: String,
	passresetid: String
})

module.exports = mongoose.model('users', schema);