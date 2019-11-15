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
			type: String,
			required: false
		}
	],
	required: {
		type: Boolean,
		required: true
	},
	mandatory: {
		type: Boolean,
		default: false
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

CertTemplateSchema.methods._doAddData = async function(data, field) {
	const names = data.map(newDataElement => newDataElement.name);
	this.data[field] = this.data[field].filter(dataElem => !names.includes(dataElem.name));
	this.data[field] = this.data[field].concat(data);

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.addCertData = async function(data) {
	return await this._doAddData(data, "cert");
};

CertTemplateSchema.methods.addOthersData = async function(data) {
	return await this._doAddData(data, "others");
};

CertTemplateSchema.methods.addParticipantData = async function(data) {
	return await this._doAddData(data, "participant");
};

CertTemplateSchema.methods._doToggleRequired = async function(data, field) {
	const names = data.map(newDataElement => newDataElement.name);

	this.data[field] = this.data[field].map(dataElem => {
		if (!dataElem.mandatory && names.includes(dataElem.name))
			dataElem.required = !dataElem.required;
		return dataElem;
	});

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.toggleRequiredCertData = async function(data) {
	return await this._doToggleRequired(data, "cert");
};

CertTemplateSchema.methods.toggleRequiredForParticipantData = async function(data) {
	return await this._doToggleRequired(data, "participant");
};

CertTemplateSchema.methods.toggleRequiredForOthersData = async function(data) {
	return await this._doToggleRequired(data, "others");
};

CertTemplateSchema.methods._doSetDefaultData = async function(data, defaultValue, field) {
	var formatDataByType = function(type, value) {
		switch (type) {
			case Constants.CERT_FIELD_TYPES.Boolean:
				return value == "true";
			case Constants.CERT_FIELD_TYPES.Checkbox:
				return value;
			case Constants.CERT_FIELD_TYPES.Date:
				return value;
			case Constants.CERT_FIELD_TYPES.Number:
				return parseInt(value, 10);
			case Constants.CERT_FIELD_TYPES.Paragraph:
				return value;
			case Constants.CERT_FIELD_TYPES.Text:
				return value;
		}
	};
	const names = data.map(dataElement => dataElement.name);

	this.data[field] = this.data[field].map(dataElem => {
		if (names.includes(dataElem.name)) {
			dataElem.defaultValue = formatDataByType(dataElem.type, defaultValue);
		}
		return dataElem;
	});

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.setDefaultForParticipantData = async function(data, defaultValue) {
	return await this._doSetDefaultData(data, defaultValue, "participant");
};

CertTemplateSchema.methods.setDefaultForOthersData = async function(data, defaultValue) {
	return await this._doSetDefaultData(data, defaultValue, "others");
};

CertTemplateSchema.methods.setDefaultForCertData = async function(data, defaultValue) {
	return await this._doSetDefaultData(data, defaultValue, "cert");
};

CertTemplateSchema.methods._doDeleteData = async function(data, field) {
	const names = data.map(dataElement => dataElement.name);
	this.data[field] = this.data[field].filter(dataElem => !names.includes(dataElem.name));

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

CertTemplateSchema.methods.deleteParticipantData = async function(data) {
	return await this._doDeleteData(data, "participant");
};

CertTemplateSchema.methods.deleteOthersData = async function(data) {
	return await this._doDeleteData(data, "others");
};

CertTemplateSchema.methods.deleteCertData = async function(data) {
	return await this._doDeleteData(data, "cert");
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

CertTemplate.generate = async function(name) {
	try {
		const query = { name: name, deleted: false };
		const template = await CertTemplate.findOne(query);
		if (template) return null;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	let template = new CertTemplate();
	template.name = name;
	template.data = {
		cert: [
			{
				name: Constants.CERT_FIELD_MANDATORY.NAME,
				defaultValue: name,
				type: Constants.CERT_FIELD_TYPES.Text,
				required: true,
				mandatory: true
			},
			{
				name: Constants.CERT_FIELD_MANDATORY.FIRST_NAME,
				defaultValue: "",
				type: Constants.CERT_FIELD_TYPES.Text,
				required: true,
				mandatory: true
			},
			{
				name: Constants.CERT_FIELD_MANDATORY.LAST_NAME,
				defaultValue: "",
				type: Constants.CERT_FIELD_TYPES.Text,
				required: true,
				mandatory: true
			}
		],
		participant: [],
		others: []
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
