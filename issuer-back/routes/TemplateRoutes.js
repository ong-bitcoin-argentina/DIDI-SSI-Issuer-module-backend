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

router.post(
	"/request/:requestCode",
	Validator.validate([
		{
			name: "dids",
			validate: [Constants.VALIDATION_TYPES.IS_ARRAY]
		},
		{
			name: "certName",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dids = req.body.dids;
		const certName = req.body.certName;
		const requestCode = req.params.requestCode;

		try {
			const cb = Constants.ADDRESS + ":" + Constants.PORT + "/api/1.0/didi_issuer/participant/" + requestCode;
			const data = {
				callbackUrl: cb,
				claims: {
					verifiable: {
						[certName]: null
					},
					user_info: { "FULL NAME": { essential: true } }
				}
			};
			const result = await MouroService.createShareRequest(data);
			for (let did of dids) await MouroService.sendShareRequest(did, result);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.get(
	"/:id/qr/:requestCode",
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
		const requestCode = req.params.requestCode;
		try {
			const template = await TemplateService.getById(id);
			const cb =
				Constants.ADDRESS +
				":" +
				Constants.PORT +
				"/api/1.0/didi_issuer/participant/" +
				template._id +
				"/" +
				requestCode;
			const data = {
				callbackUrl: cb,
				claims: {
					user_info: { "FULL NAME": { essential: true } }
				}
			};
			template.data.participant.forEach(element => {
				const name = element.name;
				if (req != "DID" && req != "EXPIRATION DATE") data["claims"]["user_info"][name] = null;
			});

			console.log(data);
			const cert = await MouroService.createShareRequest(data);
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
			name: "category",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
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
		const category = req.body.category;
		const id = req.params.id;

		try {
			let template = await TemplateService.edit(id, data, preview, type, category);
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
