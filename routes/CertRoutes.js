const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const { CERT_REVOCATION, TOKEN_VALIDATION } = require("../constants/Validators");

const CertService = require("../services/CertService");
const TokenService = require("../services/TokenService");
const TemplateService = require("../services/TemplateService");
const MouroService = require("../services/MouroService");
const { getDID, toDTO } = require("./utils/CertDTO");
const Template = require("../models/Template");

const { checkValidationResult, validate } = Validator;

/**
 * @openapi
 *   /cert/all:
 *   get:
 *     summary: Obtener la lista con info de los certificados generados por el issuer
 *     description: La lista se muestra en una tabla de certificados
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
router.get("/all", validate([TOKEN_VALIDATION.Read_Certs]), checkValidationResult, async function (_, res) {
	try {
		const certs = await CertService.getAll();
		const result = toDTO(certs);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		console.log(err);
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 * @openapi
 *   /cert/find:
 *   get:
 *     summary: Listar certificados emitidos
 *     description: Si se ingresa una fecha en el campo emmited, devuelve los certificados emitidos en dicha fecha. Si se ingresa la variable revoke, devuelve los certificados revocados.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: emmited
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: revoked
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/find", validate([TOKEN_VALIDATION.Read_Certs]), checkValidationResult, async function (req, res) {
	try {
		const result = await CertService.findBy(req.query);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err);
	}
});

/**
 * @openapi
 *   /cert/:{id}:
 *   get:
 *     summary: Retornar un certificado a partir de su id
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
			validate: [Constants.USER_TYPES.Read_Certs],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
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
 * @openapi
 *   /cert:
 *   post:
 *     summary: Generar un nuevo certificado a partir de la data y el modelo de certificado
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - templateId
 *         - data
 *         - split
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
 *                 type: string
 *               split:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 properties:
 *                   cert:
 *                     type: array    
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *                   participant:
 *                     type: array    
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           value:
 *                             type: string
 *                   others:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *               microCredentials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     names:
 *                       type: array
 *                       items:
 *                         type: string
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
			validate: [Constants.USER_TYPES.Write_Certs],
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
	async function (req, res) {
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
 * @openapi
 *   /cert/:{id}:
 *   put:
 *     summary: Modifica un certificado con los datos recibidos
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
 *         - templateId
 *         - data
 *         - split
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
 *                 type: string
 *               split:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 properties:
 *                   cert:
 *                     type: array    
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *                   participant:
 *                     type: array    
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           value:
 *                             type: string
 *                   others:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *               microCredentials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     names:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.put(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Certs],
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
	async function (req, res) {
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
 * Marca un certificado como borrado y lo revoca en caso de haber sido emitido
 */
/**
 * @openapi
 *   /cert/:{id}:
 *   delete:
 *     summary: Marca un certificado como borrado y lo revoca en caso de haber sido emitido
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
 *         - reason
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", validate(CERT_REVOCATION), checkValidationResult, async function (req, res) {
	const { id } = req.params;
	const { reason } = req.body;
	const { token } = req.headers;

	try {
		const { userId } = TokenService.getTokenData(token);
		const cert = await CertService.deleteOrRevoke(id, reason, userId);
		const { registerId } = await Template.findById(cert.templateId);
		const did = getDID(cert);
		const calls = cert.jwts.map(jwt => MouroService.revokeCertificate(jwt.data, jwt.hash, did, registerId));
		await Promise.all(calls);
		return ResponseHandler.sendRes(res, cert);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 * @openapi
 *   /cert/:{id}/emmit:
 *   post:
 *     summary: Dado un id enviar certificado a didi-server para ser emitido
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
router.post(
	"/:id/emmit",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Certs],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const id = req.params.id;
		let cert;
		try {
			cert = await CertService.getById(id);
			let template = await TemplateService.getById(cert.templateId);

			const partData = cert.data.participant.map(array => {
				return array.map(data => {
					return { value: data.value, name: data.name };
				});
			});

			let credentials = [];
			// para cada participante, generar un cert, sus micro y guardarlos en mouro
			for (let part of partData) {
				cert.split
					? await generateCertificate(credentials, template, cert, part)
					: await generateFullCertificate(credentials, template, cert, part);
			}

			let result = cert;
			// actualizar estado en la bd local
			if (credentials.length) result = await CertService.emmit(cert, credentials);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			if (err.message && cert) {
				const { data } = cert;
				const newMessage = `(nombre: ${data.participant[0][1].value}, certificado: ${data.cert[0].value}): ${err.message}`;
				return ResponseHandler.sendErr(res, { ...err, message: newMessage });
			}
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /cert/updateAllDeleted:
 *   post:
 *     summary: Actualizar el estado de los certificados eliminados(deleted=true) a un estado de revocados (revocation= fecha de emisión)
 *     description: Usar con precaución
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
router.post(
	"/updateAllDeleted",
	validate([TOKEN_VALIDATION.Write_Certs]),
	checkValidationResult,
	async function (req, res) {
		try {
			const result = await CertService.updateAllDeleted();
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err);
		}
	}
);

// crea certificado completo (sin microcredenciales)
const generateFullCertificate = async function (credentials, template, cert, part) {
	try {
		const allData = cert.data.cert.concat(part).concat(cert.data.others);
		const name = cert.data.cert[0].value;
		const data = {};
		data[name] = MouroService.getSkeletonForEmmit(template);

		let did, expDate;
		allData.forEach(dataElem => {
			switch (dataElem.name) {
				case Constants.CERT_FIELD_MANDATORY.DID:
					did = dataElem.value;
					break;
				case Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE:
					expDate = dataElem.value;
					break;
				default:
					data[name]["data"][dataElem.name] = dataElem.value;
					break;
			}
		});

		const { registerId } = template;

		const resFull = await MouroService.createCertificate(data, expDate, did, template);
		const savedFull = await MouroService.saveCertificate(resFull, true, registerId);
		credentials.push(savedFull);

		return Promise.resolve(credentials);
	} catch (err) {
		return Promise.reject(err);
	}
};

// crea certificado y sus microcredenciales
const generateCertificate = async function (credentials, template, cert, part) {
	// generar microcredencial
	const generatePartialCertificate = async function (name, certData, expDate, did) {
		try {
			const data = {};
			data[name] = {
				data: {}
			};

			certData.forEach(dataElem => {
				if (
					dataElem.value !== undefined &&
					dataElem.name != Constants.CERT_FIELD_MANDATORY.DID &&
					dataElem.name != Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE
				)
					data[name]["data"][dataElem.name] = dataElem.value;
			});

			const credential = await MouroService.createCertificate(data, expDate, did, template);
			return Promise.resolve(credential);
		} catch (err) {
			return Promise.reject(err);
		}
	};

	try {
		const allData = cert.data.cert.concat(part).concat(cert.data.others);
		const name = cert.data.cert[0].value;
		const data = {};
		const microCreds = {};

		let did, expDate;
		let allNames = [];
		let usedNames = [];

		// recorrer el certificado y obtener la info para cada microcredencial
		allData.forEach(dataElem => {
			switch (dataElem.name) {
				case Constants.CERT_FIELD_MANDATORY.DID:
					did = dataElem.value;
					break;
				case Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE:
					expDate = dataElem.value;
					break;
			}

			for (let microCredData of cert.microCredentials) {
				const names = microCredData.names;
				if (names.indexOf(dataElem.name) >= 0) {
					if (!microCreds[microCredData.title]) microCreds[microCredData.title] = [];
					microCreds[microCredData.title].push(dataElem);
					usedNames.push(dataElem.name);
				}
			}
			allNames.push(dataElem.name);
		});

		let extra = [];
		allNames.forEach(name => {
			if (usedNames.indexOf(name) < 0) extra.push(name);
		});

		extra.forEach(name => {
			const dataElem = allData.find(elem => elem.name === name);
			if (dataElem) {
				if (!microCreds["Otros Datos"]) microCreds["Otros Datos"] = [];
				microCreds["Otros Datos"].push(dataElem);
			}
		});

		const generateCertPromises = [];
		const generateCertNames = Object.keys(microCreds);
		for (let microCredsName of generateCertNames) {
			const cert = generatePartialCertificate(microCredsName, microCreds[microCredsName], expDate, did);
			generateCertPromises.push(cert);
		}

		// crear las microcredenciales
		const microCredentials = await Promise.all(generateCertPromises);

		data[name] = MouroService.getSkeletonForEmmit(template, true);

		const saveCertPromises = [];
		const { registerId } = template;
		for (let i = 0; i < microCredentials.length; i++) {
			const microCred = microCredentials[i];
			const saveCred = MouroService.saveCertificate(microCred, false, registerId);
			saveCertPromises.push(saveCred);

			data[name].wrapped[generateCertNames[i]] = microCred;
		}

		const generateFull = MouroService.createCertificate(data, expDate, did, template);
		saveCertPromises.push(generateFull);

		// guardar microcredenciales y generar la macrocredencial
		const res = await Promise.all(saveCertPromises);

		for (let i = 0; i < res.length; i++) {
			if (i != res.length - 1) {
				credentials.push(res[i]);
			} else {
				// guardar macrocredencial
				const savedFull = await MouroService.saveCertificate(res[i], true, registerId);
				credentials.push(savedFull);
			}
		}

		// retornal array con todas las credenciales generadas
		return Promise.resolve(credentials);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports = router;
