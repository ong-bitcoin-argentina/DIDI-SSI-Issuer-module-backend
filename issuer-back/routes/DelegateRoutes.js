const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const DelegateService = require("../services/DelegateService");
const BlockchainService = require("../services/BlockchainService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

/* 
	retorna todos los dids a los que el issuer delego su permiso para emitir certificados
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
			const delegates = await DelegateService.getAll();
			return ResponseHandler.sendRes(res, delegates);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/* 
	autoriza al did recibido a emitir certificados
*/
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
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
			// saco el ethr:did: si esta en ese formato
			let cleanDid = did.split(":");
			cleanDid = cleanDid[cleanDid.length - 1];

			// autorizo en la blockchain
			await BlockchainService.addDelegate(
				Constants.ISSUER_SERVER_DID,
				{ from: Constants.ISSUER_SERVER_DID, key: Constants.ISSUER_SERVER_PRIVATE_KEY },
				cleanDid
			);

			// registro autorizacion en la bd local
			const delegate = await DelegateService.create(did, name);

			return ResponseHandler.sendRes(res, delegate);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/* 
	revoca autorizacion al did recibido para emitir certificados
*/
router.delete(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
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

			// revoco autorizacion en la blockchain
			await BlockchainService.removeDelegate(
				Constants.ISSUER_SERVER_DID,
				{ from: Constants.ISSUER_SERVER_DID, key: Constants.ISSUER_SERVER_PRIVATE_KEY },
				cleanDid
			);

			// registro revocacion en la bd local
			const delegate = await DelegateService.delete(did);

			return ResponseHandler.sendRes(res, delegate);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
