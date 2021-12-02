/* eslint-disable max-len */
const router = require('express').Router();
const register = require('../controllers/register');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');

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
 *         - description
 *         - key
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               key:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
    { name: 'did', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'name',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
    {
      name: 'description',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
    {
      name: 'key',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  Validator.validateFile,
  register.create,
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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Templates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  register.readAll,
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
  '/all/blockchain',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  register.readAllBlockchains,
);

/**
 * @openapi
 *   /register/{did}:
 *   patch:
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *               newDelegate:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/:did',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  Validator.validateFile,
  register.updateByDid,
);

/**
 * @openapi
 *   /register/{did}/retry:
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
  '/:did/retry',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  register.retryByDid,
);

/**
 * @openapi
 *   /register/{did}/refresh:
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
  '/:did/refresh',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  register.refreshByDid,
);

/**
 * @openapi
 *   /register/{did}:
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
  '/:did',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  register.removeByDid,
);

/**
 * @openapi
 *   register/shareRequest/{did}:
 *   post:
 *     summary: Manda un shareRequest a didi-server para ser guardado
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
 *         - name
 *         - callback
 *         - claims
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               callback:
 *                 type: string
 *               claims:
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
  '/shareRequests/:did',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'callback', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'claims', validate: [Constants.VALIDATION_TYPES.IS_ARRAY] },
  ]),
  Validator.checkValidationResult,
  register.createShareRequestsByDid,
);

module.exports = router;

/**
 * @openapi
 *   /register/shareRequests/{did}:
 *   get:
 *     summary: Obtener la lista de todas las shareRequests de un emisor
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
  '/shareRequests/:did',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  register.readShareRequestsByDid,
);

module.exports = router;
