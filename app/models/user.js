var mongoose = require('mongoose'),
	bcrypt	 = require('bcrypt');

var userSchema = mongoose.Schema({
	email: String,
    active: Boolean,
    username: String,
    password: String,
    dateAdded: Date,
    things: [String],
    friends: [String]
});

// Methods
// Generate a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// Create model and expose it to app
module.exports = mongoose.model('User', userSchema);