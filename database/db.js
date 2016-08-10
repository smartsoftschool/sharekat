var jsonfile = require('jsonfile');

const file = 'db.json';

const db = {
	customers: [ ],
	users: [ ]
};

module.exports = {
	db: db,
	load: function () {
		jsonfile.readFile(file, function (err, obj) {
			if (!err) {
				if(obj.customers) db.customers = obj.customers;
				if(obj.categories) db.categories = obj.categories;
				if(obj.users) db.users = obj.users;
			}
		})
	},
	save: function () {
		jsonfile.writeFile(file, db, function (err) {
			if (err) throw (err);
		})
	},
	getEntityById: function (collection, id) {
		return db[collection].filter(x => {
			return x.id == id;
		})[0];
	}
};
