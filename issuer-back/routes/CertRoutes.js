const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

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
				return {
					_id: cert._id,
					name: cert.data.cert[0].value,
					emmitedOn: cert.emmitedOn,
					firstName: cert.data.participant[0][1].value,
					lastName: cert.data.participant[0][2].value
				};
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
		let cert;
		try {
			cert = await CertService.getById(id);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		let template;
		try {
			template = await CertTemplateService.getById(cert.templateId);
			const result = CertService.addTemplateDataToCert(cert, template);
			return ResponseHandler.sendRes(res, result);
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
			let template = await CertTemplateService.getById(cert.templateId);

			const partData = cert.data.participant.map(array => {
				return array.map(data => {
					return { value: data.value, name: data.name };
				});
			});

			let credentials = [];
			partData.forEach(async element => {
				const allData = cert.data.cert.concat(element).concat(cert.data.others);
				const data = {};
				data[cert.data.cert[0].value] = {
					preview: {
						type: template.previewData.length/2,
						fields: template.previewData
					},
					data: {}
				};

				let did;
				allData.forEach(dataElem => {
					if (dataElem.name === "DID") {
						did = dataElem.value;
					} else {
						if (dataElem.value) data[cert.data.cert[0].value]["data"][dataElem.name] = dataElem.value;
					}
				});

				const credential = await MouroService.createCertificate(data, did);
				await MouroService.saveCertificate(credential);
				credentials.push(credential);
			});

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
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const data = JSON.parse(req.body.data);
		const templateId = req.body.templateId;

		try {
			const result = [];

			for (let participantData of data.participant) {
				const certData = {
					cert: data.cert,
					participant: [participantData],
					others: data.others
				};

				const cert = await CertService.create(certData, templateId);
				result.push(cert);
			}

			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.put(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_VALID_TOKEN_ADMIN],
			isHead: true
		},
		{ name: "templateId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const data = JSON.parse(req.body.data);

		try {
			const cert = await CertService.edit(id, data);
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
