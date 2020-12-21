const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const UserDTO = require("./utils/UserDTO");

/**
 *	Genera un usuario para el issuer
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Admin],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "profileId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { name, password, profileId } = req.body;
			await UserService.create(name, password, profileId);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Genera un usuario ADMIN para el issuer (Valido si la variable de entorno "ENABLE_INSECURE_ENDPOINTS" esta habilitada)
 */
router.post(
	"/admin",
	Validator.validate([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			if (!Constants.ENABLE_INSECURE_ENDPOINTS) {
				return ResponseHandler.sendErrWithStatus(res, new Error("Disabled endpoint"), 404);
			}

			const { name, password } = req.body;
			await UserService.createAdmin(name, password);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Valida que la contraseña se corresponda con la del usuario,
 *	no genera ningún token ni información útil.
 */
router.post(
	"/login",
	Validator.validate([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const name = req.body.name;
		const password = req.body.password;
		try {
			const user = await UserService.login(name, password);
			return ResponseHandler.sendRes(res, user);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Marca un usuario como borrado
 */
router.delete(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Admin],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const id = req.params.id;
		try {
			const user = await UserService.delete(id);
			return ResponseHandler.sendRes(res, UserDTO.toDTO(user));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 *	retorna la lista de todos los usuarios
 */
router.get(
	"/all",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Admin],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const users = await UserService.getAll();
			const result = users.map(user => UserDTO.toDTO(user));
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 *	edita un usuario
 */
router.put(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Admin],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "profileId",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { profileId, name, password } = req.body;
		const id = req.params.id;

		try {
			await UserService.edit(id, name, password, profileId);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
