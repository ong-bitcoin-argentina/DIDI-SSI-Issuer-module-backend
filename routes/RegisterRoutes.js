const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const RegisterService = require("../services/RegisterService");
const { CERT_REVOCATION, TOKEN_VALIDATION } = require("../constants/Validators");

const TokenService = require("../services/TokenService");
const RegisterDTO = require("./utils/RegisterDTO");

const { checkValidationResult, validate } = Validator;

/**
 * @openapi
 *   /register:
 *   post:
 *     summary: Crear un nuevo registro de delegación de un nuevo emisor en la blockchain elegida
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - did
 *         - name
 *         - key
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               name:
 *                 type: string
 *               key:
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
			validate: [Constants.USER_TYPES.Admin],
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

			const register = await RegisterService.newRegister(did, key, name, token);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /register:
 *   get:
 *     summary: Obtener la lista de todos los registros
 *     description: Como filtro de los registros opcionalmente se puede pasar una query, para mas información consultar el repositorio.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
  *       - in: query
 *         name: query
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Read_Templates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const registers = await RegisterService.getAll(req.query);
			const result = registers.map(register => RegisterDTO.toDTO(register));
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /register/all/blockchain:
 *   get:
 *     summary: Obtener la lista de todas las blockchains
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
	"/all/blockchain",
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
			return ResponseHandler.sendRes(res, Constants.BLOCKCHAINS);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /register/:{did}:
 *   post:
 *     summary: Editar un registro
 *     description: Las definiciones de status se encuentran en elarchivo constants/Constants.js
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: header
 *         name: did
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
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
	"/:did",
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
			const { did } = req.params;
			const register = await RegisterService.editRegister(did, req.body);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /register/:{did}/retry:
 *   post:
 *     summary: Vuelve a intentar el delegate del Registro en DIDI
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: did
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
router.post(
	"/:did/retry",
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
			const { did } = req.params;
			const { token } = req.headers;
			const register = await RegisterService.retryRegister(did, token);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /register/:{did}/refresh:
 *   post:
 *     summary: Refrescar registro en DIDI
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: did
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
router.post(
	"/:did/refresh",
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
			const { did } = req.params;
			const { token } = req.headers;
			const register = await RegisterService.refreshRegister(did, token);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
 * Revoca un registro
 */
/**
 * @openapi
 *   /register/:{did}:
 *   delete:
 *     summary: Revocar un registro
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: did
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
router.delete(
	"/:did",
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
			const { did } = req.params;
			const { token } = req.headers;
			const register = await RegisterService.revoke(did, token);
			return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
