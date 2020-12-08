const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const BlockchainService = require("../services/BlockchainService");
const { CERT_REVOCATION, TOKEN_VALIDATION } = require("../constants/Validators");

const TokenService = require("../services/TokenService");
const RegisterDTO = require("./utils/RegisterDTO");

const { checkValidationResult, validate } = Validator;

/**
 * Registra un nuevo registro en la blockchain
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "name",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		},
		{
			name: "key",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { did, name, key } = req.body;
			const { token } = req.headers;

			const register = await BlockchainService.newRegister(did, key, name, token);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 *	retorna la lista de todos los registros
 */
router.get(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_OBSERVER],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const registers = await BlockchainService.getAll(req.query);
			const result = registers.map(register => RegisterDTO.toDTO(register));
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 *	retorna la lista de todas las blockchains
 */
router.get(
	"/all/blockchain",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_OBSERVER],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			return ResponseHandler.sendRes(res, Constants.BLOCKCHAINS);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 * Cambia un Registro
 */

router.put(
	"/:did",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { did } = req.params;
			const register = await BlockchainService.editRegister(did, req.body);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
