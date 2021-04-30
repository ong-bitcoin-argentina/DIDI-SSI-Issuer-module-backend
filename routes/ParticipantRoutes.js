const router = require("express").Router();
const ParticipantService = require("../services/ParticipantService");
const MouroService = require("../services/MouroService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

/**
 * @openapi
 *   /participant/dids:
 *   get:
 *     summary: Retorna los dids y nombres de todos los participantes conocidos.
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
	"/dids",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Dids_Registers],
			isHead: true
		}
	]),
	Validator.checkValidationResult,

	async function (_, res) {
		try {
			const partDids = await ParticipantService.getAllDids();
			const result = [];
			for (let key of Object.keys(partDids)) result.push({ did: key, name: partDids[key] });
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/global:
 *   get:
 *     summary: Retorna los participantes con informacion no vinculada a un modelo de certificado en particular.
 *     description: Indica que tipo de informacion posee (cual de los certificados).
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
	"/global",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Dids_Registers],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (_, res) {
		// retorna true si en names hay algun nombre correspondiente a uno de los campos de partData
		const containsData = function (partData, names) {
			return partData.data.find(data => names.indexOf(data.name) >= 0) !== undefined;
		};

		try {
			const participants = await ParticipantService.getGlobalParticipants();
			const result = participants.map(partData => {
				return {
					did: partData.did,
					name: partData.name,

					// si tiene el tel, tiene el certificado de "telefono"
					tel: containsData(partData, ["Phone"]),

					// si tiene el mail, tiene el certificado de "mail"
					mail: containsData(partData, ["email"]),

					// si tiene el dni o nacionalidad, tiene el certificado de "info personal"
					personal: containsData(partData, ["dni", "nationality"]),

					// si tiene alguno de los campos asociados al certificado de direccion, tiene el certificado de "direccion"
					address: containsData(partData, [
						"streetAddress",
						"numberStreet",
						"floor",
						"department",
						"zipCode",
						"city",
						"municipality",
						"province",
						"country"
					])
				};
			});
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/all/:{templateId}:
 *   get:
 *     summary: Retorna los participantes con informacion vinculada a un modelo de certificado.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: templateId
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
	"/all/:templateId",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Dids_Registers],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const templateId = req.params.templateId;
		try {
			const participants = await ParticipantService.getAllByTemplateId(templateId);
			const result = participants.map(partData => {
				return { did: partData.did, name: partData.name };
			});
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/new/:{requestCode}:
 *   get:
 *     summary: Retorna la informacion del participante con el codigo indicado, si la data fue modificada.
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
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */

router.get(
	"/new/:requestCode",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Dids_Registers],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const requestCode = req.params.requestCode;
		try {
			const participant = await ParticipantService.getByRequestCode(requestCode);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/:{did}:
 *   get:
 *     summary: Retorna la info de participante asociada a un usuario en particular.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: did
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
	"/:did",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Dids_Registers],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.params.did;
		try {
			const participant = await ParticipantService.getByDid(did);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/new/:
 *   post:
 *     summary: Inicializa la data de participante con unicamente el did y nombre.
 *     description: Carga por csv.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - "name"
 *                     - "did"
 *                   properties:
 *                     name:
 *                       type: string
 *                     did:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - "name"
 *                           - "value"
 *                         properties:
 *                             name:
 *                               type: string
 *                             value:
 *                               type: string
 *                     templateId:
 *                       type: string
 *                     requestCode:
 *                       type: string
 *                     new:
 *                       type: boolean
 *                     deleted:
 *                       type: boolean
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */

router.post(
	"/new/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Dids_Registers],
			isHead: true
		},
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_NEW_PARTICIPANTS_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const data = req.body.data;
		// const dids = data.map(dataElem => dataElem.did);
		try {
			let result = [];
			for (let dataElem of data) {
				const participant = await ParticipantService.create(dataElem.name, dataElem.did, [], undefined, "");
				if (participant.did && participant.name) result.push({ did: participant.did, name: participant.name });
			}
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/:{id}/:
 *   put:
 *     summary: Modifica la data de participante con los datos recibidos.
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
 *         - templateId
 *         - data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               templateId:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - "name"
 *                     - "did"
 *                   properties:
 *                     name:
 *                       type: string
 *                     did:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - "name"
 *                           - "value"
 *                         properties:
 *                             name:
 *                               type: string
 *                             value:
 *                               type: string
 *                     templateId:
 *                       type: string
 *                     requestCode:
 *                       type: string
 *                     new:
 *                       type: boolean
 *                     deleted:
 *                       type: boolean
 *                     createdOn:
 *                       type: string
 *                       format: date-time
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
			validate: [Constants.USER_TYPES.Write_Dids_Registers],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "templateId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_PART_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const id = req.params.id;
		const name = req.body.name;
		const templateId = req.body.templateId;
		const data = JSON.parse(req.body.data);

		try {
			let participant = await ParticipantService.edit(id, name, data, templateId);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/:{id}:
 *   delete:
 *     summary: Marca la data de participante como borrada.
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

router.delete(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Dids_Registers],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const id = req.params.id;

		try {
			const participant = await ParticipantService.delete(id);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

// -- disclosure requests --

/**
 * @openapi
 *   /participant/:{requestCode}:
 *   post:
 *     summary: Carga de info de participante global a partir de un pedido de certificado realizado con "/template/request/:requestCode".
 *     parameters:
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - access_token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
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
	"/:requestCode",
	Validator.validate([{ name: "access_token", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function (req, res) {
		const requestCode = req.params.requestCode;
		const jwt = req.body.access_token;

		try {
			// decodificar pedido
			const data = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);

			let name = data.payload.own["FULL NAME"];
			const dataElems = [];

			// por cada certificado pedido
			for (let payload of data.payload.verified) {
				// decodificarlo
				const reqData = await MouroService.decodeCertificate(payload, Messages.CERTIFICATE.ERR.VERIFY);
				const subject = reqData.payload.vc.credentialSubject;
				// extraer info
				for (let key of Object.keys(subject)) {
					const data = subject[key].data;
					for (let dataKey of Object.keys(data)) {
						const dataValue = data[dataKey];
						const key = dataKey.toLowerCase() === "phonenumber" ? "Phone" : dataKey;
						if (dataKey && dataValue) dataElems.push({ name: key, value: dataValue });
					}
				}
			}
			// guardar info en bd local
			const participant = await ParticipantService.create(name, data.payload.iss, dataElems, undefined, requestCode);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /participant/:{templateId}/:{requestCode}:
 *   post:
 *     summary: Carga de info de participante para un template en particular a partir del QR generado en "/template/:id/qr/:requestCode".
 *     parameters:
 *       - name: templateId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - access_token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
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
	"/:templateId/:requestCode",
	Validator.validate([{ name: "access_token", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function (req, res) {
		const requestCode = req.params.requestCode;
		const templateId = req.params.templateId;
		const jwt = req.body.access_token;

		try {
			// decodificar pedido
			const data = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);

			let name;
			const dataElems = [];

			const own = data.payload.own;
			// extraer info para cada uno de los campos recibidos
			for (let key of Object.keys(own)) {
				const val = own[key];
				if (key === "FULL NAME" && val) {
					name = val;
				} else {
					if (key && val) dataElems.push({ name: key, value: val });
				}
			}

			// guardar info en bd local
			const participant = await ParticipantService.create(name, data.payload.iss, dataElems, templateId, requestCode);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
