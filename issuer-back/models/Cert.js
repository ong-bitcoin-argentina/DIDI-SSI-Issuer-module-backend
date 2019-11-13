const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;
const Constants = require("../constants/Constants");

const dataElement = {
	name: {
		type: String,
		required: true
	},
	value: {
		type: String,
		default: "",
		required: true
	},
	type: {
		type: String,
		enum: Object.keys(Constants.CERT_FIELD_TYPES),
		required: true
	}
};

const CertSchema = mongoose.Schema({
	templateId: {
		type: ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	participant: {
		name: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		}
	},
	data: {
		cert: [dataElement],
		participant: [dataElement],
		others: [dataElement]
	},
	deleted: {
		type: Boolean,
		default: false
	},
	emmitedOn: {
		type: Date
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

CertSchema.index({ name: 1 });

CertSchema.methods.delete = async function() {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await Cert.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const Cert = mongoose.model("Cert", CertSchema);
module.exports = Cert;

Cert.generate = async function(template, participantData, data) {
	let cert = new Cert();
	cert.participant = participantData;
	cert.templateId = template._id;
	cert.name = template.name;
	cert.data = data;
	cert.createdOn = new Date();
	cert.deleted = false;

	try {
		cert = await cert.save();
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Cert.getAll = async function() {
	try {
		const query = { deleted: false };
		const template = await Cert.find(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Cert.getById = async function(id) {
	try {
		const query = { _id: id, deleted: false };
		const template = await Cert.findOne(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
