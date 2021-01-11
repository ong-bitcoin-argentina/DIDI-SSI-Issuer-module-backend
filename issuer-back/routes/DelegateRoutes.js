const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const DelegateService = require("../services/DelegateService");
const BlockchainService = require("../services/BlockchainService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Register = require("../models/Register");
const { getDidClean } = require("./utils/DidClean");
const Messages = require("../constants/Messages");

/**
 *	retorna todos los dids a los que el issuer delego su permiso para emitir certificados
 */
router.get(
	"/all",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Delegates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (_, res) {
		try {
			const delegates = await DelegateService.getAll();
			const result = delegates.map(delegate => {
				return { did: delegate.did, name: delegate.name };
			});
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	autoriza al did recibido a emitir certificados
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Delegates],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "did",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		},
		{
			name: "registerId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { name, did, registerId } = req.body;
		try {
			const register = await Register.getById(registerId);
			if (!register) throw Messages.REGISTER.ERR.NOT_EXIST;
			const { cleanDid } = getDidClean(register.did);

			// autorizo en la blockchain
			await BlockchainService.addDelegate(cleanDid, { from: cleanDid, key: register.private_key }, did);

			// registro autorizacion en la bd local
			const delegate = await DelegateService.create(did, name);
			return ResponseHandler.sendRes(res, { did: delegate.did, name: delegate.name });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	revoca autorizacion al did recibido para emitir certificados
 */
router.delete(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Delegates],
			isHead: true
		},
		{
			name: "did",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		try {
			// revoco autorizacion en la blockchain
			await BlockchainService.removeDelegate(
				Constants.ISSUER_SERVER_DID,
				{ from: Constants.ISSUER_SERVER_DID, key: Constants.ISSUER_SERVER_PRIVATE_KEY },
				did
			);

			// registro revocacion en la bd local
			const delegate = await DelegateService.delete(did);

			return ResponseHandler.sendRes(res, { did: delegate.did, name: delegate.name });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Cambiar el nombre que se mostrara en todos los certificados que emita este issuer o sus delegados
 */
router.post(
	"/name",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Delegates],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const name = req.body.name;

		try {
			// seteo el nombre en la blockchain
			await BlockchainService.setDelegateName(
				Constants.ISSUER_SERVER_DID,
				{ from: Constants.ISSUER_SERVER_DID, key: Constants.ISSUER_SERVER_PRIVATE_KEY },
				name
			);
			return ResponseHandler.sendRes(res, name);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Retornar el nombre que se mostrara en todos los certificados que emita este issuer o sus delegados
 */
router.get(
	"/name",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Delegates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			// seteo el nombre en la blockchain
			const name = await BlockchainService.getDelegateName(Constants.ISSUER_SERVER_DID);
			return ResponseHandler.sendRes(res, name);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Cambiar el nombre que se mostrara en todos los certificados que emita este issuer o sus delegados
 */
router.post(
	"/didDelegationValid",
	Validator.validate([{ name: "didDelegate", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function (req, res) {
		const didDelegate = req.body.didDelegate;
		try {
			// seteo el nombre en la blockchain
			const result = await BlockchainService.validDelegate(
				Constants.ISSUER_SERVER_DID,
				{ from: Constants.ISSUER_SERVER_DID, key: Constants.ISSUER_SERVER_PRIVATE_KEY },
				didDelegate
			);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
