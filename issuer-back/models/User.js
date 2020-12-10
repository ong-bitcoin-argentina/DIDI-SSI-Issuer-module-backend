const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Constants = require("../constants/Constants");
const HashedData = require("./dataTypes/HashedData");

// Usuario para loguearse en el issuer
// (de momento solo sirve para eso)
const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: HashedData,
	types: [
		{
			type: String,
			enum: Object.keys(Constants.USER_TYPES),
			required: true
		}
	],
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

// verifica la clave
UserSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		const result = Hashing.validateHash(candidatePassword, this.password);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// actualiza la clave
UserSchema.methods.updatePassword = async function (password) {
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

// marca usuario como borrado
UserSchema.methods.delete = async function () {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

// edita un usuario
UserSchema.methods.edit = async function (name, pass, types) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: {
			password: await Hashing.saltedHash(pass),
			name,
			types
		}
	};

	try {
		const user = await User.findOneAndUpdate(updateQuery, updateAction);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

// crea un nuevo usuario
User.generate = async function (name, pass, types) {
	let user;
	try {
		const query = { name: name, deleted: false };
		user = await User.findOne(query);

		if (!user) user = new User();

		user.password = await Hashing.saltedHash(pass);
		user.name = name;
		user.deleted = false;
		user.createdOn = new Date();
		user.types = types;

		user = await user.save();
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener todos los usuarios
User.getAll = async function () {
	try {
		const query = { deleted: false };
		const users = await User.find(query).sort({ createdOn: -1 });
		return Promise.resolve(users);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
