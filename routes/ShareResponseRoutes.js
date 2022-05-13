const router = require("express").Router();
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");
const shareResponse = require("../controllers/shareResponse");

//ToDo:check if we have to add more parameters
/**
 * @openapi
 *   /shareResponses/{did}:
 *   post:
 *     summary: Manda un shareResponse a didi-server para ser guardado
 *     tags:
 *       - shareRequests
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - vc
 *         - req
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               req:
 *                 type: string
 *               vc:
 *                 type: array
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
	"/shareResponses/:did",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.USER_TYPES.Write_ShareRequest],
			isHead: true
		},
		{ name: "req", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "vc", validate: [Constants.VALIDATION_TYPES.IS_ARRAY] }
	]),
	Validator.checkValidationResult,
	shareResponse.create
);

module.exports = router;
