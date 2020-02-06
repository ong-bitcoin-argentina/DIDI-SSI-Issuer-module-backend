const router = require("express").Router();
const ParticipantService = require("../services/ParticipantService");
const MouroService = require("../services/MouroService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

router.get("/dids", async function(req, res) {
	try {
		const partDids = await ParticipantService.getAllDids();
		const result = [];
		for (let key of Object.keys(partDids)) result.push({ did: key, name: partDids[key] });
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.get("/all/:templateId", async function(req, res) {
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
});

router.get("/new/:requestCode", async function(req, res) {
	const requestCode = req.params.requestCode;
	try {
		const participant = await ParticipantService.getByRequestCode(requestCode);
		return ResponseHandler.sendRes(res, participant);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.get("/:did", async function(req, res) {
	const did = req.params.did;
	try {
		const participant = await ParticipantService.getByDid(did);
		return ResponseHandler.sendRes(res, participant);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.post(
	"/new/",
	Validator.validate([
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_NEW_PARTICIPANTS_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
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

router.put(
	"/:id/",
	Validator.validate([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "templateId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_PART_DATA]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
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

router.delete("/:id", async function(req, res) {
	const id = req.params.id;

	try {
		const participant = await ParticipantService.delete(id);
		return ResponseHandler.sendRes(res, participant);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

// -- disclosure requests --
// carga de info de participante global a partir de un pedido de certificado
router.post(
	"/:requestCode",
	Validator.validate([{ name: "access_token", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const requestCode = req.params.requestCode;
		const jwt = req.body.access_token;

		try {
			const data = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);

			let name = data.payload.own["FULL NAME"];
			const dataElems = [];

			for (let payload of data.payload.verified) {
				const reqData = await MouroService.decodeCertificate(payload, Messages.CERTIFICATE.ERR.VERIFY);
				const subject = reqData.payload.vc.credentialSubject;
				for (let key of Object.keys(subject)) {
					const data = subject[key].data;
					for (let dataKey of Object.keys(data)) {
						const dataValue = data[dataKey];
						const key = dataKey.toLowerCase() === "phonenumber" ? "Phone" : dataKey;
						if (dataKey && dataValue) dataElems.push({ name: key, value: dataValue });
					}
				}
			}
			const participant = await ParticipantService.create(name, data.payload.iss, dataElems, undefined, requestCode);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

// carga de info de participante para un template en particular a partir del QR
router.post(
	"/:templateId/:requestCode",
	Validator.validate([{ name: "access_token", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const requestCode = req.params.requestCode;
		const templateId = req.params.templateId;
		const jwt = req.body.access_token;

		try {
			const data = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);

			let name;
			const dataElems = [];

			const own = data.payload.own;
			for (let key of Object.keys(own)) {
				const val = own[key];
				if (key === "FULL NAME" && val) {
					name = val;
				} else {
					if (key && val) dataElems.push({ name: key, value: val });
				}
			}

			const participant = await ParticipantService.create(name, data.payload.iss, dataElems, templateId, requestCode);
			return ResponseHandler.sendRes(res, participant);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
