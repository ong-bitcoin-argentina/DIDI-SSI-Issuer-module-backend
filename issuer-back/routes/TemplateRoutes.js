const router = require("express").Router();
const TemplateService = require("../services/TemplateService");
const MouroService = require("../services/MouroService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const { toDTO } = require("./utils/TemplateDTO");
const Constants = require("../constants/Constants");

/**
 *	retorna la lista con info de los modelos de certificados generados por el issuer para mostrarse en la tabla de modelos de certificados
 */
router.get(
	"/all",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Templates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (_, res) {
		try {
			const templates = await TemplateService.getAll();
			const result = toDTO(templates);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Retorna un modelo de certificado a partir del id
 */
router.get(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Templates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
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

/**
 *	Genera un nuevo modelo de certificado sin contenido
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Templates],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "registerId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { name, registerId } = req.body;

		try {
			const template = await TemplateService.create(name, registerId);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Modifica un modelo de certificado con los datos recibidos
 */
router.put(
	"/:id/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Templates],
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
		},
		{
			name: "registerId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const data = JSON.parse(req.body.data);
		const { preview, type, registerId } = req.body;

		const category = req.body.category || "";
		const id = req.params.id;

		try {
			let template = await TemplateService.edit(id, data, preview, type, category, registerId);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Marca un modelo de certificado como borrado
 */
router.delete(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Delete_Templates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const id = req.params.id;

		try {
			const template = await TemplateService.delete(id);
			return ResponseHandler.sendRes(res, template);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

// -- disclosure requests --

/**
 *	Emite un pedido de info de participante global a partir de un pedido de certificado
 */
router.post(
	"/request/:requestCode",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Templates],
			isHead: true
		},
		{
			name: "dids",
			validate: [Constants.VALIDATION_TYPES.IS_ARRAY]
		},
		{
			name: "certNames",
			validate: [Constants.VALIDATION_TYPES.IS_ARRAY]
		},
		{
			name: "registerId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { dids, certNames, requestCode, registerId } = req.body;

		try {
			// llamar al metodo '/participant/${requestCode}' con el resultado
			const cb = Constants.ADDRESS + ":" + Constants.PORT + "/api/1.0/didi_issuer/participant/" + requestCode;
			const verifiable = {};

			// pedir todos los certificados en 'certNames' a los usuarios cuyos dids se correspondan con 'dids'
			for (let certName of certNames) {
				verifiable[certName] = null;
			}

			const claims = {
				verifiable: verifiable,
				user_info: { "FULL NAME": { essential: true } }
			};
			const result = await MouroService.createShareRequest(claims, cb, registerId);

			// un pedido para cada usuario
			for (let did of dids) await MouroService.sendShareRequest(did, result, registerId);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Genera un QR para pedir info de participante para un template en particular
 */
router.get(
	"/:id/qr/:requestCode/:registerId",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Templates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { id, requestCode, registerId } = req.params;
		try {
			const template = await TemplateService.getById(id);

			// llamar al metodo 'participant/${templateId}/${requestCode}' con el resultado
			const cb =
				Constants.ADDRESS +
				":" +
				Constants.PORT +
				"/api/1.0/didi_issuer/participant/" +
				template._id +
				"/" +
				requestCode;

			const claims = {
				user_info: { "FULL NAME": { essential: true } }
			};

			// pedir todos los campos que el template requiere del participante
			template.data.participant.forEach(element => {
				const name = element.name;
				if (name != "DID" && name != "EXPIRATION DATE") {
					// mapeo los campos conocidos (los de los certificados de tel, mail y data de renaper)
					if (Constants.TYPE_MAPPING[name]) {
						claims["user_info"][Constants.TYPE_MAPPING[name]] = null;
					} else {
						claims["user_info"][name] = null;
					}
				}
			});

			const cert = await MouroService.createShareRequest(claims, cb, registerId);
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
