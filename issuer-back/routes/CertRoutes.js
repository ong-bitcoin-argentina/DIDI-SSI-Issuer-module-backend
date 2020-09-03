const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const { CERT_REVOCATION, TOKEN_VALIDATION } = require("../constants/Validators");

const CertService = require("../services/CertService");
const TemplateService = require("../services/TemplateService");
const MouroService = require("../services/MouroService");
const { getDID, toDTO } = require("../constants/DTO/CertDTO");
const Cert = require("../models/Cert");

const { checkValidationResult, validate } = Validator;

/**
 *	retorna la lista con info de los certificados generados por el issuer para mostrarse en la tabla de certificados
 */
router.get("/all", validate([TOKEN_VALIDATION]), checkValidationResult, async function (_, res) {
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
 *	lista de certificados emitidos
 */
router.get("/find", validate([TOKEN_VALIDATION]), checkValidationResult, async function (req, res) {
	try {
		const result = await CertService.findBy(req.query);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err);
	}
});

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
 * Marca un certificado como borrado y lo revoca en caso de haber sido emitido (no implementado aun)
 */
router.delete("/:id", validate(CERT_REVOCATION), checkValidationResult, async function (req, res) {
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
});

/**
 * permite crear un certificado y enviarlo al didi-server para ser emitido
 */
router.post(
	"/:id/emmit",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
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
			if (err.message && cert)
				err.message =
					"(nombre: " +
					cert.data.participant[0][1].value +
					", certificado: " +
					cert.data.cert[0].value +
					"): " +
					err.message;
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * revoca un certificado
 */
router.patch("/:id/revoke", validate(CERT_REVOCATION), checkValidationResult, async function (req, res) {
	try {
		const { id } = req.params;
		const { reason } = req.body;
		const cert = await CertService.revoke(id, reason);
		const did = getDID(cert);

		for (let jwt of cert.jwts) {
			const result = await MouroService.revokeCertificate(jwt.data, jwt.hash, did);
		}

		return ResponseHandler.sendRes(res, cert);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err);
	}
});

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

		const resFull = await MouroService.createCertificate(data, expDate, did);
		const savedFull = await MouroService.saveCertificate(resFull, true);
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

			const credential = await MouroService.createCertificate(data, expDate, did);
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
		for (let i = 0; i < microCredentials.length; i++) {
			const microCred = microCredentials[i];
			const saveCred = MouroService.saveCertificate(microCred, false);
			saveCertPromises.push(saveCred);

			data[name].wrapped[generateCertNames[i]] = microCred;
		}

		const generateFull = MouroService.createCertificate(data, expDate, did);
		saveCertPromises.push(generateFull);

		// guardar microcredenciales y generar la macrocredencial
		const res = await Promise.all(saveCertPromises);

		for (let i = 0; i < res.length; i++) {
			if (i != res.length - 1) {
				credentials.push(res[i]);
			} else {
				// guardar macrocredencial
				const savedFull = await MouroService.saveCertificate(res[i], true);
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
