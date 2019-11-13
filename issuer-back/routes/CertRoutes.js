const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const CertService = require("../services/CertService");
const CertTemplateService = require("../services/CertTemplateService");
const MouroService = require("../services/MouroService");

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
				return { _id: cert._id, name: cert.name, emmitedOn: cert.emmitedOn, participant: cert.participant };
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
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/:id/emmit",
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
			const cert = await CertService.emmit(id);

			const data = {
				certificateData: cert.data.cert.map(data => {
					return { value: data.value, name: data.name };
				}),
				participantData: cert.data.participant.map(data => {
					return { value: data.value, name: data.name };
				}),
				otherData: cert.data.others.map(data => {
					return { value: data.value, name: data.name };
				}),
				emmitedOn: cert.emmitedOn
			};

			cert.data.cert.push({
				name: Messages.CERTIFICATE.CERT_FIELDS.NAME,
				value: cert.name
			});
			cert.data.participant.push({
				name: Messages.CERTIFICATE.CERT_FIELDS.PARTICIPANT_NAME,
				value: cert.participant.name
			});
			cert.data.participant.push({
				name: Messages.CERTIFICATE.CERT_FIELDS.PARTICIPANT_LAST_NAME,
				value: cert.participant.lastName
			});

			const credential = MouroService.createCertificate(data);
			if (Constants.DEBUGG) console.log(credential);

			// mandar certificado a mouro
			await CertificateService.saveCertificate(cert);

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
