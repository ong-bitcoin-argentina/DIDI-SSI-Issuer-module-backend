const router = require("express").Router();
const TemplateService = require("../services/TemplateService");
const MouroService = require("../services/MouroService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const { toDTO } = require("./utils/TemplateDTO");
const Constants = require("../constants/Constants");

/**
 * @openapi
 *   /template/all:
 *   get:
 *     summary: Retorna la lista con info de los modelos de certificados generados por el issuer para mostrarse en la tabla de modelos de certificados.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /template/:{id}:
 *   get:
 *     summary: Retorna un modelo de certificado a partir del id.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /template:
 *   post:
 *     summary: Genera un nuevo modelo de certificado sin contenido.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               registerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /template/:{id}/:
 *   put:
 *     summary: Modifica un modelo de certificado con los datos recibidos.
 *     description: Las definiciones de type se encuentran en el archivo constants/Constants.js objeto "CERT_FIELD_TYPES"
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - data
 *         - preview
 *         - category
 *         - type
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   cert:
 *                     type: array    
 *                     items:
 *                       type: object
 *                       required:
 *                         - "name"
 *                         - "required"
 *                       properties:
 *                         name:
 *                           type: string
 *                         defaultValue:
 *                           type: string
 *                         type:
 *                           type: string
 *                         options:
 *                           type: array    
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                         required:
 *                           type: boolean
 *                         mandatory:
 *                           type: boolean
 *                   participant:
 *                     type: array    
 *                     items:
 *                       type: object
 *                       required:
 *                         - "name"
 *                         - "required"
 *                       properties:
 *                         name:
 *                           type: string
 *                         defaultValue:
 *                           type: string
 *                         type:
 *                           type: string
 *                         options:
 *                           type: array    
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                         required:
 *                           type: boolean
 *                         mandatory:
 *                           type: boolean
 *                   others:
 *                     type: array    
 *                     items:
 *                       type: object
 *                       required:
 *                         - "name"
 *                         - "required"
 *                       properties:
 *                         name:
 *                           type: string
 *                         defaultValue:
 *                           type: string
 *                         type:
 *                           type: string
 *                         options:
 *                           type: array    
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                         required:
 *                           type: boolean
 *                         mandatory:
 *                           type: boolean
 *               preview:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *               registerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /template/:{id}:
 *   delete:
 *     summary: Marca un modelo de certificado como borrado.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - name
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               registerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /template/request/:{requestCode}:
 *   post:
 *     summary: Emite un pedido de info de participante global a partir de un pedido de certificado.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - dids
 *         - certNames
 *         - registerId
 *         - requestCode
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dids:
 *                 type: array    
 *                 items:
 *                   type: string
 *               certNames:
 *                 type: array    
 *                 items:
 *                   type: string
 *               registerId:
 *                 type: string
 *               requestCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /template/:{id}/qr/:{requestCode}/:{registerId}:
 *   get:
 *     summary: Genera un QR para pedir info de participante para un template en particular.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *       - name: registerId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
