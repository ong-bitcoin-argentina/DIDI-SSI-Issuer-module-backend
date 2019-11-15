const router = require("express").Router();
const CertTemplateService = require("../services/CertTemplateService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

router.get(
	"/all",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function(_, res) {
		try {
			const templates = await CertTemplateService.getAll();
			const result = templates.map(template => {
				return { _id: template._id, name: template.name };
			});
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.get(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		try {
			const template = await CertTemplateService.getById(id);
			delete template.deleted;
			delete template.createdOn;
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const name = req.body.name;

		try {
			const template = await CertTemplateService.create(name);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/data",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		},
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		},
		{
			name: "type",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA_TYPE]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const data = JSON.parse(req.body.data);
		const id = req.params.id;
		const type = req.body.type;

		try {
			let template;
			switch (type) {
				case Constants.DATA_TYPES.CERT:
					template = await CertTemplateService.addCertData(id, data);
					break;
				case Constants.DATA_TYPES.PARTICIPANT:
					template = await CertTemplateService.addParticipantData(id, data);
					break;
				case Constants.DATA_TYPES.OTHERS:
					template = await CertTemplateService.addOthersData(id, data);
					break;
			}
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/default",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		},
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		},
		{
			name: "type",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA_TYPE]
		},
		{
			name: "defaultValue",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA_VALUE]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const data = JSON.parse(req.body.data);
		const defaultValue = req.body.defaultValue;
		const type = req.body.type;

		try {
			let template;
			switch (type) {
				case Constants.DATA_TYPES.CERT:
					template = await CertTemplateService.setDefaultForCertData(id, data, defaultValue);
					break;
				case Constants.DATA_TYPES.PARTICIPANT:
					template = await CertTemplateService.setDefaultForParticipantData(id, data, defaultValue);
					break;
				case Constants.DATA_TYPES.OTHERS:
					template = await CertTemplateService.setDefaultForOthersData(id, data, defaultValue);
					break;
			}
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/required",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		},
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		},
		{
			name: "type",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA_TYPE]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const data = JSON.parse(req.body.data);
		const type = req.body.type;

		try {
			let template;
			switch (type) {
				case Constants.DATA_TYPES.CERT:
					template = await CertTemplateService.toggleRequiredForCertData(id, data);
					break;
				case Constants.DATA_TYPES.PARTICIPANT:
					template = await CertTemplateService.toggleRequiredForParticipantData(id, data);
					break;
				case Constants.DATA_TYPES.OTHERS:
					template = await CertTemplateService.toggleRequiredForOthersData(id, data);
					break;
			}
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/:id/data",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		},
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		},
		{
			name: "type",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA_TYPE]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const data = JSON.parse(req.body.data);
		const type = req.body.type;

		try {
			let template;
			switch (type) {
				case Constants.DATA_TYPES.CERT:
					template = await CertTemplateService.deleteCertData(id, data);
					break;
				case Constants.DATA_TYPES.PARTICIPANT:
					template = await CertTemplateService.deleteParticipantData(id, data);
					break;
				case Constants.DATA_TYPES.OTHERS:
					template = await CertTemplateService.deleteOthersData(id, data);
					break;
			}
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;

		try {
			const template = await CertTemplateService.delete(id);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
