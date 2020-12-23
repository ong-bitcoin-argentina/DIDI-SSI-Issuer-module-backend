const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const ProfileService = require("../services/ProfileService");

const { checkValidationResult, validate } = Validator;
const { Read_Profiles, Write_Profiles, Delete_Profiles } = Constants.USER_TYPES;

const validateToken = role => ({
	name: "token",
	validate: [Constants.USER_TYPES[role]],
	isHead: true
});

const validations = role => [
	validateToken(role),
	{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
	{ name: "types", validate: [Constants.VALIDATION_TYPES.IS_ARRAY] }
];

/**
 * Registra un nuevo perfil
 */
router.post(
	"/",
	Validator.validate(validations(Write_Profiles)),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const profile = await ProfileService.createProfile(req.body);
			return ResponseHandler.sendRes(res, profile);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Obtiene todos los perfiles
 */
router.get(
	"/",
	Validator.validate([validateToken(Read_Profiles)]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const profiles = await ProfileService.getAllProfiles();
			return ResponseHandler.sendRes(res, profiles);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Edita un perfil
 */
router.put(
	"/:id",
	Validator.validate(validations(Write_Profiles)),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { id } = req.params;
			const profile = await ProfileService.editProfile(id, req.body);
			return ResponseHandler.sendRes(res, profile);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Borra un perfil
 */
router.delete(
	"/:id",
	Validator.validate([validateToken(Delete_Profiles)]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { id } = req.params;
			const profile = await ProfileService.delete(id);
			return ResponseHandler.sendRes(res, profile);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
