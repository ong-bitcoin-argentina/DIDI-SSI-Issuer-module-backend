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
		enum: Object.keys(Constants.CERT_FIELD_TYPES)
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

const TemplateSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	previewData: [{ type: String }],
	previewType: { type: String },
	category: {
		type: String,
		enum: Object.keys(Constants.CERT_CATEGORY_TYPES),
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

TemplateSchema.index({ name: 1 });

TemplateSchema.methods.edit = async function(data, previewData, previewType, category) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: {
			category: category,
			previewData: previewData,
			previewType: previewType,
			data: data
		}
	};

	try {
		const template = await Template.findOneAndUpdate(updateQuery, updateAction);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

TemplateSchema.methods.delete = async function() {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await Template.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const Template = mongoose.model("Template", TemplateSchema);
module.exports = Template;

Template.generate = async function(name) {
	try {
		const query = { name: name, deleted: false };
		const template = await Template.findOne(query);
		if (template) return null;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	let template = new Template();
	template.name = name;
	template.previewType = "1";
	template.previewData = [Constants.CERT_FIELD_MANDATORY.FIRST_NAME, Constants.CERT_FIELD_MANDATORY.LAST_NAME];
	template.data = {
		cert: [
			{
				name: Constants.CERT_FIELD_MANDATORY.NAME,
				defaultValue: name,
				type: Constants.CERT_FIELD_TYPES.Text,
				required: true,
				mandatory: true
			}
		],
		participant: [
			{
				name: Constants.CERT_FIELD_MANDATORY.DID,
				defaultValue: "",
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
			},
			{
				name: Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE,
				defaultValue: "",
				type: Constants.CERT_FIELD_TYPES.Date,
				required: false,
				mandatory: false
			}
		],
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

Template.getAll = async function() {
	try {
		const query = { deleted: false };
		const template = await Template.find(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Template.getById = async function(id) {
	try {
		const query = { _id: id, deleted: false };
		const template = await Template.findOne(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
