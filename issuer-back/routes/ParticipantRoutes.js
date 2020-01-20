const router = require("express").Router();
const ParticipantService = require("../services/ParticipantService");
const MouroService = require("../services/MouroService");
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

router.get("/all/:templateId", async function(req, res) {
	const templateId = req.params.templateId;
	try {
		const participants = await ParticipantService.getAllByTemplateId(templateId);
		const result = participants.map(partData => {
			return { _id: partData._id, name: partData.name };
		});
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.get("/new/:templateId", async function(req, res) {
	const templateId = req.params.templateId;
	try {
		const participant = await ParticipantService.getNewByTemplateId(templateId);
		return ResponseHandler.sendRes(res, participant);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.get("/:id", async function(req, res) {
	const id = req.params.id;
	try {
		const participant = await ParticipantService.getById(id);
		return ResponseHandler.sendRes(res, participant);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.post(
	"/:templateId",
	Validator.validate([{ name: "access_token", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const templateId = req.params.templateId;
		const jwt = req.body.access_token;

		try {
			// const data = await MouroService.verifyCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);
			const data = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);
 
			let name;
			const dataElems = [{ name: "DID", value: data.payload.iss }];

			const own = data.payload.own;
			for (let key of Object.keys(own)) {
				const val = own[key];
				if (key === "FULL NAME") {
					name = val;
				} else {
					dataElems.push({ name: key, value: val });
				}
			}

			const participant = await ParticipantService.create(name, dataElems, templateId);
			return ResponseHandler.sendRes(res, participant);
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

module.exports = router;
