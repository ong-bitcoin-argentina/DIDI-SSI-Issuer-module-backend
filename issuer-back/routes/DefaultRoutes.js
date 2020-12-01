const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const DefaultService = require("../services/DefaultService");

/**
 * Registra un nuevo default
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{
			name: "templateId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const default_ = await DefaultService.newDefault(req.body);
			return ResponseHandler.sendRes(res, default_);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 *	retorna el default
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
			const default_ = await DefaultService.get();
			return ResponseHandler.sendRes(res, default_);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 * Cambia el default
 */

router.put(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{ name: "registerId", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "templateId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const default_ = await DefaultService.editDefault(req.body);
			return ResponseHandler.sendRes(res, default_);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
