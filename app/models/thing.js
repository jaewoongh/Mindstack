var mongoose = require('mongoose'),
	bcrypt	 = require('bcrypt');

var thingSchema = mongoose.Schema({
    content: String,
    owner: String,
    writer: String,
    active: Boolean,
    dateAdded: Date
});

// Create model and expose it to app
module.exports = mongoose.model('User', thingSchema);