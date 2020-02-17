const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

const CertService = require("../services/CertService");
const TemplateService = require("../services/TemplateService");
const MouroService = require("../services/MouroService");

/**
 *	retorna la lista con info de los certificados generados por el issuer para mostrarse en la tabla de certificados
 */
router.get(
	"/all",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
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
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	retorna un certificado a partir de su id
 */
router.get(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
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
			template = await TemplateService.getById(cert.templateId);
			// agregar data del template al certificado (tipos, valores por defecto, etc)
			const result = CertService.addTemplateDataToCert(cert, template);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Genera un nuevo certificado a partir de la data y el modelo de certificado
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{ name: "templateId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA]
		},
		{
			name: "split",
			validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN]
		},
		{
			name: "microCredentials",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_MICRO_CRED_DATA],
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		try {
			const data = JSON.parse(req.body.data);
			const templateId = req.body.templateId;
			const split = req.body.split;
			const microCredentials = req.body.microCredentials ? req.body.microCredentials : [];

			const result = [];
			for (let participantData of data.participant) {
				let cert;
				const certData = {
					cert: data.cert,
					participant: [participantData],
					others: data.others
				};

				cert = await CertService.create(certData, templateId, split, microCredentials);
				if (cert) result.push(cert);
			}
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Modifica un certificado con los datos recibidos
 */
router.put(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{ name: "templateId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA]
		},
		{
			name: "split",
			validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN]
		},
		{
			name: "microCredentials",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_MICRO_CRED_DATA],
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;
		const data = JSON.parse(req.body.data);
		const split = req.body.split;
		const microCredentials = req.body.microCredentials;

		try {
			const cert = await CertService.edit(id, data, split, microCredentials);
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Marca un certificado como borrado y lo revoca en caso de haber sido emitido (no implementado aun)
 */
router.delete(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const id = req.params.id;

		try {
			const cert = await CertService.delete(id);
			const did = cert.data.participant[0][0].value;

			const calls = [];
			for (let jwt of cert.jwts) {
				calls.push(MouroService.revokeCertificate(jwt.data, jwt.hash, did));
			}

			await Promise.all(calls);
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
