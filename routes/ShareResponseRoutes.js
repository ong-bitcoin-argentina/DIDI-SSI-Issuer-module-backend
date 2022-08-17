const router = require('express').Router();
const Constants = require('../constants/Constants');
const Validator = require('./utils/Validator');
const shareResponse = require('../controllers/shareResponse');
const { halfHourLimiter } = require('../policies/RateLimit');

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
 *         - jwt
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
  Validator.validateUserToken,
  halfHourLimiter,
  Validator.validate([
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
 *   /shareResponse/{did}:
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
  '/:did',
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
 *   /shareResponse/searchCredentials/{term}:
 *   get:
 *     summary: Obtener dids y sus credenciales por diferentes criterios de busqueda
 *     tags:
 *       - shareResponse
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: term
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
  '/searchCredentials/:term',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_ShareResponse],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  shareResponse.searchCredentials,
);

module.exports = router;
