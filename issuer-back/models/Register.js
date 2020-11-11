const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Constants = require("../constants/Constants");
const HashedData = require("./dataTypes/HashedData");

const RegisterSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	did: {
		type: String,
		required: true,
		unique: true
	},
	key: {
		type: String,
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

RegisterSchema.index({ name: 1 });

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;

// crea un nuevo registro
Register.generate = async function (did, key, name) {
	let register;
	try {
		register = new Register();

		register.name = name;
		register.key = key;
		register.did = did;
		register.deleted = false;
		register.createdOn = new Date();

		register = await register.save();
		return Promise.resolve(register);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener todos los registros
Register.getAll = async function () {
	try {
		const query = { deleted: false };
		const registers = await Register.find(query).sort({ createdOn: -1 });
		return Promise.resolve(registers);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener un registro por el did
Register.getByDID = async function (did) {
	return await Register.findOne({ did });
};
