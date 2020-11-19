const mongoose = require("mongoose");
const Constants = require("../constants/Constants");
const { cardSchema } = require("./dataTypes/CardSchema");
const { getCardLayout } = require("./utils/Card");

// Modelo de certificado a partir del cual se podran generar certificados particulares
// define la data que tendra que agregarse a los mismos y la forma en que esta se mostrara en la app

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
	backgroundImage: String,
	category: {
		type: String,
		enum: Constants.CERT_CATEGORY_TYPES
	},
	registerId: {
		type: String
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

TemplateSchema.add({ cardLayout: cardSchema });

// modificar modelo de certificado
TemplateSchema.methods.edit = async function (data, previewData, previewType, category, registerId) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: {
			category: category,
			registerId,
			previewData: previewData,
			previewType: previewType,
			cardLayout: getCardLayout(previewType),
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

// marcare modelo de certificado como borrado
TemplateSchema.methods.delete = async function () {
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

// crear modelo de certificado "vacio" (con los campos por defecto)
Template.generate = async function (name, registerId) {
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
	template.registerId = registerId;
	template.previewType = "1";
	template.previewData = [Constants.CERT_FIELD_MANDATORY.FIRST_NAME, Constants.CERT_FIELD_MANDATORY.LAST_NAME];
	template.cardLayout = getCardLayout(template.previewType);

	template.category = Constants.CERT_CATEGORY_TYPES[0];
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

// obtener todos los modelos de certificados
Template.getAll = async function () {
	try {
		const query = { deleted: false };
		const template = await Template.find(query).sort({ createdOn: -1 });
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener modelo de certificado a partir de su id
Template.getById = async function (id) {
	try {
		const query = { _id: id, deleted: false };
		const template = await Template.findOne(query);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
