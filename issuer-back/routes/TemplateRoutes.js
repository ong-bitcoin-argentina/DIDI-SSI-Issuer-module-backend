const router = require("express").Router();
const TemplateService = require("../services/TemplateService");
const MouroService = require("../services/MouroService");
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
			const templates = await TemplateService.getAll();
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
	"/:id/qr",
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
			const template = await TemplateService.getById(id);
			const requested = template.data.participant
				.map(dataElem => dataElem.name)
				.filter(req => req != "DID" && req != "EXPIRATION DATE");
			requested.push("FULL NAME");
			const cb = Constants.ADDRESS + ":" + Constants.PORT + "/api/1.0/didi_issuer/participant/" + template._id;

			const cert = await MouroService.createShareRequest(cb, requested);

			return ResponseHandler.sendRes(res, cert);
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
			const template = await TemplateService.getById(id);
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
			const template = await TemplateService.create(name);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/",
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
			name: "preview",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_PREVIEW_DATA]
		},
		{
			name: "type",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const data = JSON.parse(req.body.data);
		const preview = req.body.preview;
		const type = req.body.type;
		const id = req.params.id;

		try {
			let template = await TemplateService.edit(id, data, preview, type);
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
			const template = await TemplateService.delete(id);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
