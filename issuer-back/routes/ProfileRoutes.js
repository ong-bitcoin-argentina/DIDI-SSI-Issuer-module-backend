const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const ProfileService = require("../services/ProfileService");

const { checkValidationResult, validate } = Validator;

const validateToken = {
	name: "token",
	validate: [Constants.USER_TYPES.Admin],
	isHead: true
};

const validations = [
	validateToken,
	{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
	{ name: "types", validate: [Constants.VALIDATION_TYPES.IS_ARRAY] }
];

/**
 * Registra un nuevo perfil
 */
router.post("/", Validator.validate(validations), Validator.checkValidationResult, async function (req, res) {
	try {
		const profile = await ProfileService.createProfile(req.body);
		return ResponseHandler.sendRes(res, profile);
	} catch (err) {
		console.log(err);
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 * Obtiene todos los perfiles
 */
router.get("/", Validator.validate([validateToken]), Validator.checkValidationResult, async function (req, res) {
	try {
		const profiles = await ProfileService.getAllProfiles();
		return ResponseHandler.sendRes(res, profiles);
	} catch (err) {
		console.log(err);
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 * Edita un perfil
 */
router.put("/:id", Validator.validate(validations), Validator.checkValidationResult, async function (req, res) {
	try {
		const { id } = req.params;
		const profile = await ProfileService.editProfile(id, req.body);
		return ResponseHandler.sendRes(res, profile);
	} catch (err) {
		console.log(err);
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 * Borra un perfil
 */
router.delete("/:id", Validator.validate([validateToken]), Validator.checkValidationResult, async function (req, res) {
	try {
		const { id } = req.params;
		const profile = await ProfileService.delete(id);
		return ResponseHandler.sendRes(res, profile);
	} catch (err) {
		console.log(err);
		return ResponseHandler.sendErr(res, err);
	}
});

module.exports = router;
