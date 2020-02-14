const mongoose = require("mongoose");

// Registro local de las delegaciones del issuer para emitir certificados
const DelegateSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	did: {
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

DelegateSchema.index({ did: 1 });

const Delegate = mongoose.model("Delegate", DelegateSchema);
module.exports = Delegate;

// obtiene todas las delegaciones
Delegate.getAll = async function() {
	const query = { deleted: false };
	const delegates = await Delegate.find(query);
	return Promise.resolve(delegates);
};

// registra una nueva delegacion en la base de datos local
Delegate.generate = async function(did, name) {
	let delegate;
	try {
		const query = { did: name };
		delegate = await Delegate.findOne(query);

		if (!delegate) delegate = new Delegate();

		delegate.did = did;
		delegate.name = name;
		delegate.deleted = false;
		delegate.createdOn = new Date();

		delegate = await delegate.save();
		return Promise.resolve(delegate);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// marca la delegacion como borrada en la base de datos local
Delegate.delete = async function(did) {
	try {
		const query = { did: did };
		const action = { $set: { deleted: true } };
		let delegate = await Delegate.findOneAndUpdate(query, action);
		if (delegate) delegate.deleted = true;
		return Promise.resolve(delegate);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
