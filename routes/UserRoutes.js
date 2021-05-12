const router = require('express').Router();

const user = require('../conrtrollers/user');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');
const { halfHourLimiter } = require('../policies/RateLimit');

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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Users],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'password',
      validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    {
      name: 'profileId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  user.create,
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
  '/admin',
  Validator.validate([
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'password',
      validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  user.createAdmin,
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
  '/login',
  Validator.validate([
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'password',
      validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
  ]),
  Validator.checkValidationResult,
  user.validatePassword,
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
  '/:id',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Delete_Users],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  user.remove,
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
  '/all',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Users],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  user.readAll,
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
  '/:id',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Users],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'profileId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  user.update,
);

module.exports = router;
