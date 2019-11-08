const router = require("express").Router();
const CertTemplateService = require("../services/CertTemplateService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

router.get(
	"/all",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
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
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
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
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "certData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		},
		{
			name: "participantData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		},
		{
			name: "othersData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const name = req.body.name;
		const certData = JSON.parse(req.body.certData);
		const participantData = JSON.parse(req.body.participantData);
		const othersData = JSON.parse(req.body.othersData);

		try {
			const template = await CertTemplateService.create(name, certData, participantData, othersData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/certData",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "certData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const certData = JSON.parse(req.body.certData);
		const id = req.params.id;

		try {
			const template = await CertTemplateService.addCertData(id, certData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/othersData",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "othersData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const othersData = JSON.parse(req.body.othersData);
		const id = req.params.id;

		try {
			const template = await CertTemplateService.addOthersData(id, othersData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/participantData",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "participantData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const participantData = JSON.parse(req.body.participantData);
		const id = req.params.id;

		try {
			const template = await CertTemplateService.addParticipantData(id, participantData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id/rename",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "name",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const name = req.body.name;
		const id = req.params.id;

		try {
			const template = await CertTemplateService.rename(id, name);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/:id/certData",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "certData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const certData = JSON.parse(req.body.certData);

		try {
			const template = await CertTemplateService.deleteCertData(id, certData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/:id/participantData",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "participantData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const participantData = JSON.parse(req.body.participantData);

		try {
			const template = await CertTemplateService.deleteParticipantData(id, participantData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/:id/othersData",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
		}
	]),
	Validator.validateBody([
		{
			name: "othersData",
			validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const othersData = JSON.parse(req.body.othersData);

		try {
			const template = await CertTemplateService.deleteOthersData(id, othersData);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/:id",
	Validator.validateHead([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN]
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
