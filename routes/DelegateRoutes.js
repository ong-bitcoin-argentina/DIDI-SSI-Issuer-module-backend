const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const DelegateService = require("../services/DelegateService");
const BlockchainService = require("../services/BlockchainService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const Register = require("../models/Register");
const { getCleanedDid } = require("./utils/DidClean");
const Messages = require("../constants/Messages");

/**
 * @openapi
 *   /delegate/all:
 *   get:
 *     summary: Retorna todos los dids a los que el issuer delego su permiso para emitir certificados.
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
			validate: [Constants.USER_TYPES.Read_Delegates],
			isHead: true
		}
	]),
	Validator.checkValidationResult,
	async function (_, res) {
		try {
			const delegates = await DelegateService.getAll();
			const result = delegates.map(({ did, name }) => ({ did, name }));
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /delegate:
 *   post:
 *     summary: Autoriza al did recibido a emitir certificados.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *         - did
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               did:
 *                 type: string
 *               registerId:
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
		try {
			const { name, did, registerId } = req.body;

			// autorizo en la blockchain
			await BlockchainService.addDelegate(registerId, did);

			// registro autorizacion en la bd local
			await DelegateService.create(did, name, registerId);

			return ResponseHandler.sendRes(res, { did, name });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /delegate:
 *   delete:
 *     summary: Revoca autorizacion al did recibido para emitir certificados.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - did
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
		try {
			const { did } = req.body;

			// revoco autorizacion en la blockchain
			await BlockchainService.removeDelegate(did);

			// registro revocacion en la bd local
			const { name } = await DelegateService.delete(did);

			return ResponseHandler.sendRes(res, { did, name });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /delegate/didDelegationValid:
 *   post:
 *     summary: Cambiar el nombre que se mostrara en todos los certificados que emita este issuer o sus delegados.
 *     requestBody:
 *       required:
 *         - didDelegate
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               didDelegate:
 *                 type: string
 *               registerId:
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
	"/didDelegationValid",
	Validator.validate([
		{ name: "didDelegate", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "registerId", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { didDelegate, registerId } = req.body;

			// seteo el nombre en la blockchain
			const result = await BlockchainService.validDelegate(registerId, didDelegate);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
