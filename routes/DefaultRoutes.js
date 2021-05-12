const router = require('express').Router();

const defaultValue = require('../conrtrollers/default');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');

/**
 * @openapi
 *   /default:
 *   post:
 *     summary: Registra un nuevo default.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - templateId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
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
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
    {
      name: 'templateId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  defaultValue.create,
);

/**
 * @openapi
 *   /default:
 *   get:
 *     summary: Retorna el default.
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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Templates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  defaultValue.read,
);

/**
 * @openapi
 *   /default:
 *   put:
 *     summary: Cambia el default.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - registerId
 *         - templateId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registerId:
 *                 type: string
 *               templateId:
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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
    { name: 'registerId', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'templateId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  defaultValue.update,
);

module.exports = router;
