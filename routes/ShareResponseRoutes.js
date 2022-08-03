const router = require('express').Router();
const Constants = require('../constants/Constants');
const Validator = require('./utils/Validator');
const shareResponse = require('../controllers/shareResponse');

/**
 * @openapi
 *   /shareResponse/{did}:
 *   post:
 *     summary: Recibe un shareResponse para ser guardado
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
 *         - jw
 *         - shareRequestId
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               jwt:
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
  '/:did',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_ShareRequest],
      isHead: true,
    },
    { name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'shareRequestId', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  shareResponse.create,
);

/**
 * @openapi
 *   /shareResponse/all:
 *   get:
 *     summary: Obtiene una lista con la informacion de los shareResponse
 *     tags:
 *       - shareResponse
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
  '/all',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_ShareResponse],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  shareResponse.readAll,
);

/**
 * @openapi
 *   /shareResponse/did/{did}:
 *   get:
 *     summary: Obtener la lista de todas las shareResponse de un emisor
 *     tags:
 *       - shareResponse
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
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/did/:did',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_ShareResponse],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  shareResponse.readAllByDid,
);

/**
 * @openapi
 *   /shareResponse/{id}/decoded:
 *   get:
 *     summary: Obtener la informacion de un shareResponse decoded
 *     tags:
 *       - shareResponse
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
router.get(
  '/:id/decoded',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_ShareResponse],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  shareResponse.readByIdDecoded,
);

module.exports = router;
