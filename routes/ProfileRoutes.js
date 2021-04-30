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

// Estas validaciones son para reutilizar codigo solamente en este archivo
const validations = role => [
	validateToken(role),
	{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
	{ name: "types", validate: [Constants.VALIDATION_TYPES.IS_ARRAY] }
];

/**
 * @openapi
 *   /profile:
 *   post:
 *     summary: Registra un nuevo perfil
 *     description: Los tipos de usuarios a ingresar en el arreglo de types se encuentran en constants/Constats.js como USER_TYPES
 *     requestBody:
 *       required:
 *         - name
 *         - types
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               types:
 *                 type: array    
 *                 items:
 *                   type: string
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
 * @openapi
 *   /profile:
 *   get:
 *     summary: Listar todos los perfiles
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
 * @openapi
 *   /profile/:{id}:
 *   put:
 *     summary: Editar un perfil
 *     description: Los tipos de usuarios a ingresar en el arreglo de types se encuentran en constants/Constats.js como USER_TYPES
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
 *         - types
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               types:
 *                 type: array    
 *                 items:
 *                   type: string
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
 * @openapi
 *   /profile/:{id}:
 *   delete:
 *     summary: Borrar un perfil
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
