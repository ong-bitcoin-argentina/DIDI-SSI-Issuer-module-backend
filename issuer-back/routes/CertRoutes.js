const router = require("express").Router();
const CertService = require("../services/CertService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const CertTemplateService = require("../services/CertTemplateService");

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
			const certs = await CertService.getAll();
			const result = certs.map(cert => {
				return { _id: cert._id, name: cert.name, createdOn: cert.createdOn, participant: cert.participant };
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
			const cert = await CertService.getById(id);
			delete cert.deleted;
			delete cert.createdOn;
			return ResponseHandler.sendRes(res, cert);
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
		{ name: "templateId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "firstName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "lastName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const templateId = req.body.templateId;
		const data = JSON.parse(req.body.data);

		const partData = {
			name: req.body.firstName,
			lastName: req.body.lastName
		};

		let template;
		try {
			template = await CertTemplateService.getById(templateId);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		try {
			const cert = await CertService.create(template, partData, data);
			return ResponseHandler.sendRes(res, cert);
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
			const cert = await CertService.delete(id);
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
