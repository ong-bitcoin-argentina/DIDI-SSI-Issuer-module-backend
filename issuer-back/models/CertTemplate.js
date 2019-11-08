const mongoose = require("mongoose");
const Constants = require("../constants/Constants");

const dataElement = {
	name: {
		type: String,
		required: true
	},
	defaultValue: {
		type: String,
		default: ""
	},
	type: {
		type: String,
		enum: Object.keys(Constants.CERT_FIELD_TYPES),
		required: true
	},
	options: [
		{
			type: String
		}
	],
	required: {
		type: Boolean,
		required: true
	}
};

const CertTemplateSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
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
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

CertTemplateSchema.index({ name: 1 });

CertTemplateSchema.methods.addCertData = async function(data) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data.cert = this.data.cert.filter(dataElem => !names.includes(dataElem.name));
	this.data.cert = this.data.cert.concat(data);

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.addOthersData = async function(data) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data.others = this.data.others.filter(dataElem => !names.includes(dataElem.name));
	this.data.others = this.data.others.concat(data);

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.addParticipantData = async function(data) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data.participant = this.data.participant.filter(dataElem => !names.includes(dataElem.name));
	this.data.participant = this.data.participant.concat(data);

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.rename = async function(name) {
	if (this.name == name) {
		return Promise.resolve(this);
	}

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { name: name }
	};

	try {
		await CertTemplate.findOneAndUpdate(updateQuery, updateAction);
		this.name = name;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.deleteParticipantData = async function(data) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data.participant = this.data.participant.filter(dataElem => !names.includes(dataElem.name));

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.deleteOthersData = async function(data) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data.others = this.data.others.filter(dataElem => !names.includes(dataElem.name));

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.deleteCertData = async function(data) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data.cert = this.data.cert.filter(dataElem => !names.includes(dataElem.name));

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.delete = async function() {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await CertTemplate.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const CertTemplate = mongoose.model("CertTemplate", CertTemplateSchema);
module.exports = CertTemplate;

CertTemplate.generate = async function(name, certData, participantData, othersData) {
	let template;
	try {
		const query = { name: name, deleted: false };
		template = await CertTemplate.findOne(query);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	if (!template) {
		template = new CertTemplate();
	}

	template.name = name;
	template.data = {
		cert: certData,
		participant: participantData,
		others: othersData
	};
	template.createdOn = new Date();
	template.deleted = false;

	try {
		template = await template.save();
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

CertTemplate.getAll = async function() {
	try {
		const query = { deleted: false };
		const template = await CertTemplate.find(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

CertTemplate.getById = async function(id) {
	try {
		const query = { _id: id, deleted: false };
		const template = await CertTemplate.findOne(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
