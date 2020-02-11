const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const DelegateService = require("../services/DelegateService");
const BlockchainService = require("../services/BlockchainService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

router.get("/all", async function(_, res) {
	try {
		const delegates = await DelegateService.getAll();
		return ResponseHandler.sendRes(res, delegates);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.post(
	"/",
	Validator.validate([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "did",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const name = req.body.name;
		const did = req.body.did;
		try {
			let cleanDid = did.split(":");
			cleanDid = cleanDid[cleanDid.length - 1];
			await BlockchainService.addDelegate(Constants.ISSUER_SERVER_DID, {from: Constants.ISSUER_SERVER_DID,key: Constants.ISSUER_SERVER_PRIVATE_KEY}, cleanDid)
			const delegate = await DelegateService.create(did, name);
			return ResponseHandler.sendRes(res, delegate);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.delete(
	"/",
	Validator.validate([
		{
			name: "did",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		try {
			let cleanDid = did.split(":");
			cleanDid = cleanDid[cleanDid.length - 1];
			await BlockchainService.removeDelegate(Constants.ISSUER_SERVER_DID, {from: Constants.ISSUER_SERVER_DID,key: Constants.ISSUER_SERVER_PRIVATE_KEY}, cleanDid)
			const delegate = await DelegateService.delete(did);
			return ResponseHandler.sendRes(res, delegate);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
