const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const UserDTO = require("./utils/UserDTO");
const { halfHourLimiter } = require("../policies/RateLimit");

/**
 * @openapi
 *   /user:
 *   post:
 *     summary: Generar un usuario para el issuer
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *         - password
 *         - did
 *         - profileId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               profileId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Users],
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
 * @openapi
 *   /user/admin:
 *   post:
 *     summary: Generar un usuario ADMIN para el issuer
 *     description: Valido si la variable de entorno "ENABLE_INSECURE_ENDPOINTS" esta habilitada
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *         - password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
	halfHourLimiter,
	async function (req, res) {
		try {
			if (!Constants.ENABLE_INSECURE_ENDPOINTS) {
				return ResponseHandler.sendErrWithStatus(res, new Error("Disabled endpoint"), 403);
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
 * @openapi
 *   /user/login:
 *   post:
 *     summary: Valida que la contraseña se corresponda con la del usuario
 *     description: No genera ningún token ni información útil.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *         - password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
			const { user, token } = await UserService.login(name, password);
			return ResponseHandler.sendRes(res, { ...UserDTO.toDTO(user), token });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /user/:id:
 *   delete:
 *     summary: Marca un usuario como borrado
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Delete_Users],
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

/**
 * @openapi
 *   /user/all:
 *   get:
 *     summary: Obtener la lista de todos los usuarios
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
	"/all",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Users],
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

/**
 * @openapi
 *   /user/:id:
 *   put:
 *     summary: Editar un usuario
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - name
 *         - password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               profileId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.put(
	"/:id",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_Users],
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
