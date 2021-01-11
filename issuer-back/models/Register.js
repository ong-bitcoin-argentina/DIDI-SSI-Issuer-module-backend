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
	messageError: {
		type: String
	},
	blockHash: {
		type: String
	},
	deleted: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	},
	status: {
		type: String,
		default: Constants.STATUS.PENDING
	},
	expireOn: {
		type: Date
	}
});

RegisterSchema.index({ name: 1 });
RegisterSchema.methods.edit = async function (data) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: data
	};

	try {
		return await Register.findOneAndUpdate(updateQuery, updateAction);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;

// crea un nuevo registro
Register.generate = async function (did, key, name) {
	let register;
	try {
		register = new Register();

		register.name = name;
		const key_encripted = await Encryption.encrypt(key);
		register.private_key = key_encripted;
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
Register.getAll = async function (filter) {
	try {
		const query = { deleted: false, ...filter };
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
	const register = await Register.findOne({ _id });
	if (register) {
		const private_key = await Encryption.decript(register.private_key);
		register.private_key = private_key;
	}

	return register;
};

Register.getCredentials = async function (_id) {
	const { did, private_key } = await Register.findOne({ _id });
	const key = await Encryption.decript(private_key);
	return { did, key };
};
