const mongoose = require("mongoose");
const Encryption = require("./utils/Encryption");
const Constants = require("../constants/Constants");

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
	private_key: {
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
	},
	expireOn: {
		type: Date
	}
});

RegisterSchema.index({ name: 1 });

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;

// crea un nuevo registro
Register.generate = async function (did, key, name, expireOn) {
	let register;
	try {
		register = new Register();

		register.name = name;
		const key_encripted = await Encryption.encrypt(key);
		register.private_key = key_encripted;
		register.did = did;
		register.deleted = false;
		register.createdOn = new Date();
		register.expireOn = expireOn;

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

// obtener un registro por el id
Register.getById = async function (_id) {
	return await Register.findOne({ _id });
};

Register.getCredentials = async function (_id) {
	const { did, private_key } = await Register.findOne({ _id });
	const key = await Encryption.decript(private_key);
	return { did, key };
};
