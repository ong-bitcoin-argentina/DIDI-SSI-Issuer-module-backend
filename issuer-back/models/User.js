const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Constants = require("../constants/Constants");
const HashedData = require("./dataTypes/HashedData");

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: HashedData,
	type: {
		type: String,
		enum: Object.keys(Constants.USER_TYPES),
		required: true
	},
	deleted: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

UserSchema.index({ name: 1 });

UserSchema.methods.comparePassword = async function(candidatePassword) {
	try {
		const result = Hashing.validateHash(candidatePassword, this.password);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

UserSchema.methods.updatePassword = async function(password) {
	const hashData = await Hashing.saltedHash(password);

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { password: hashData, modifiedOn: new Date() }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.password = hashData;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

User.generate = async function(name, pass) {
	let user;
	try {
		const query = { name: name, deleted: false };
		user = await User.findOne(query);

		if (!user) user = new User();

		user.password = await Hashing.saltedHash(pass);
		user.name = name;
		user.deleted = false;
		user.createdOn = new Date();

		// TODO user types
		user.type = Constants.USER_TYPES.Admin;

		user = await user.save();
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
