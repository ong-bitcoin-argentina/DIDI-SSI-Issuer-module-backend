/* eslint-disable max-len */
const router = require('express').Router();

const delegate = require('../controllers/delegate');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');

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
  '/all',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Delegates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  delegate.read,
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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Delegates],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'did',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
    {
      name: 'registerId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  delegate.create,
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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Delegates],
      isHead: true,
    },
    {
      name: 'did',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  delegate.remove,
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
  '/didDelegationValid',
  Validator.validate([
    { name: 'didDelegate', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'registerId', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  delegate.update,
);

module.exports = router;
