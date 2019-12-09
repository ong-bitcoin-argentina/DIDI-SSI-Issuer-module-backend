const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

const CertService = require("../services/CertService");
const TemplateService = require("../services/TemplateService");
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
					split: cert.split,
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
			template = await TemplateService.getById(cert.templateId);
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
			const cert = await CertService.getById(id);
			let template = await TemplateService.getById(cert.templateId);

			const partData = cert.data.participant.map(array => {
				return array.map(data => {
					return { value: data.value, name: data.name };
				});
			});

			let credentials = [];
			for (let part of partData) {
				cert.split
					? await generateCertificate(credentials, template, cert, part)
					: await generateFullCertificate(credentials, template, cert, part);
			}

			let result = cert;
			if (credentials.length) result = await CertService.emmit(cert, credentials);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

const generateFullCertificate = async function(credentials, template, cert, part) {
	try {
		const allData = cert.data.cert.concat(part).concat(cert.data.others);
		const name = cert.data.cert[0].value;
		const data = {};
		data[name] = {
			preview: {
				type: template.previewData.length / 2,
				fields: template.previewData
			},
			data: {}
		};

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
		const savedFull = await MouroService.saveCertificate(resFull);
		credentials.push(savedFull);

		return Promise.resolve(credentials);
	} catch (err) {
		return Promise.reject(err);
	}
};

const generateCertificate = async function(credentials, template, cert, part) {
	const generatePartialCertificate = async function(name, certData, expDate, did) {
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
					if (microCreds[microCredData.title]) {
						microCreds[microCredData.title].push(dataElem);
					} else {
						microCreds[microCredData.title] = [dataElem];
					}
				}
			}
		});

		const generateCertPromises = [];
		const generateCertNames = Object.keys(microCreds);
		for (let microCredsName of generateCertNames) {
			const cert = generatePartialCertificate(microCredsName, microCreds[microCredsName], expDate, did);
			generateCertPromises.push(cert);
		}

		const microCredentials = await Promise.all(generateCertPromises);

		data[name] = {
			preview: {
				type: template.previewData.length / 2,
				fields: template.previewData
			},
			data: {},
			wrapped: {}
		};

		const saveCertPromises = [];
		for (let i = 0; i < microCredentials.length; i++) {
			const microCred = microCredentials[i];
			const saveCred = MouroService.saveCertificate(microCred);
			saveCertPromises.push(saveCred);

			data[name].wrapped[generateCertNames[i]] = microCred;
		}
		const generateFull = MouroService.createCertificate(data, expDate, did);
		saveCertPromises.push(generateFull);

		const res = await Promise.all(saveCertPromises);

		for (let i = 0; i < res.length; i++) {
			if (i != res.length - 1) {
				credentials.push(res[i]);
			} else {
				const savedFull = await MouroService.saveCertificate(res[i]);
				credentials.push(savedFull);
			}
		}

		return Promise.resolve(credentials);
	} catch (err) {
		return Promise.reject(err);
	}
};

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
		},
		{
			name: "split",
			validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN]
		},
		{
			name: "microCredentials",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_MICRO_CRED_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const data = JSON.parse(req.body.data);
		const templateId = req.body.templateId;
		const split = req.body.split;
		const microCredentials = req.body.microCredentials;

		const result = [];
		for (let participantData of data.participant) {
			const certData = {
				cert: data.cert,
				participant: [participantData],
				others: data.others
			};

			let cert;
			try {
				cert = await CertService.create(certData, templateId, split, microCredentials);
			} catch (err) {
				console.log(err);
				return ResponseHandler.sendErr(res, err);
			}
			result.push(cert);
		}
		return ResponseHandler.sendRes(res, result);
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
		},
		{
			name: "split",
			validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN]
		},
		{
			name: "microCredentials",
			validate: [Constants.VALIDATION_TYPES.IS_CERT_MICRO_CRED_DATA]
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

			const calls = [];
			for (let jwt of cert.jwts) {
				calls.push(MouroService.revokeCertificate(jwt.hash));
			}

			await Promise.all(calls);
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
