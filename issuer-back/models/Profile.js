const mongoose = require("mongoose");
const Constants = require("../constants/Constants");

const ProfileSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
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

ProfileSchema.index({ name: 1 });

// Edito un perfil
ProfileSchema.methods.edit = async function (body) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: body
	};

	try {
		return await Profile.findOneAndUpdate(updateQuery, updateAction);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

ProfileSchema.methods.delete = async function () {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await Profile.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;

// obtener todos los modelos de perfiles
Profile.getAll = async function () {
	try {
		const query = { deleted: false };
		return await Profile.find(query).sort({ createdOn: -1 });
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener modelo de perfil a partir de su id
Profile.getById = async function (id) {
	try {
		const query = { _id: id, deleted: false };
		return await Profile.findOne(query);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// crea un nuevo perfil de roles
Profile.generate = async function (body) {
	try {
		return await Profile.create(body);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
