/* eslint-disable max-len */
const router = require('express').Router();

const template = require('../conrtrollers/template');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');

/**
 * @openapi
 *   /template/all:
 *   get:
 *     summary: Retorna la lista con info de los modelos de certificados generados por el issuer para mostrarse en la tabla de modelos de certificados.
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
      validate: [Constants.USER_TYPES.Read_Templates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  template.readAll,
);

/**
 * @openapi
 *   /template/:{id}:
 *   get:
 *     summary: Retorna un modelo de certificado a partir del id.
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
  '/:id',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Templates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  template.readById,
);

/**
 * @openapi
 *   /template:
 *   post:
 *     summary: Genera un nuevo modelo de certificado sin contenido.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
      validate: [Constants.USER_TYPES.Write_Templates],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'registerId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  template.create,
);

/**
 * @openapi
 *   /template/:{id}/:
 *   put:
 *     summary: Modifica un modelo de certificado con los datos recibidos.
 *     description: Las definiciones de type se encuentran en el archivo constants/Constants.js objeto "CERT_FIELD_TYPES"
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
 *         - data
 *         - preview
 *         - category
 *         - type
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   cert:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - "name"
 *                         - "required"
 *                       properties:
 *                         name:
 *                           type: string
 *                         defaultValue:
 *                           type: string
 *                         type:
 *                           type: string
 *                         options:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                         required:
 *                           type: boolean
 *                         mandatory:
 *                           type: boolean
 *                   participant:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - "name"
 *                         - "required"
 *                       properties:
 *                         name:
 *                           type: string
 *                         defaultValue:
 *                           type: string
 *                         type:
 *                           type: string
 *                         options:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                         required:
 *                           type: boolean
 *                         mandatory:
 *                           type: boolean
 *                   others:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - "name"
 *                         - "required"
 *                       properties:
 *                         name:
 *                           type: string
 *                         defaultValue:
 *                           type: string
 *                         type:
 *                           type: string
 *                         options:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                         required:
 *                           type: boolean
 *                         mandatory:
 *                           type: boolean
 *               preview:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
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
router.put(
  '/:id/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Templates],
      isHead: true,
    },
    {
      name: 'data',
      validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA],
    },
    {
      name: 'preview',
      validate: [Constants.VALIDATION_TYPES.IS_TEMPLATE_PREVIEW_DATA],
    },
    {
      name: 'category',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
    {
      name: 'type',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
    {
      name: 'registerId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  template.updateById,
);

/**
 * @openapi
 *   /template/:{id}:
 *   delete:
 *     summary: Marca un modelo de certificado como borrado.
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
 *         - registerId
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
router.delete(
  '/:id',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Delete_Templates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  template.removeById,
);

// -- disclosure requests --

/**
 * @openapi
 *   /template/request/:{requestCode}:
 *   post:
 *     summary: Emite un pedido de info de participante global a partir de un pedido de certificado.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - dids
 *         - certNames
 *         - registerId
 *         - requestCode
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dids:
 *                 type: array
 *                 items:
 *                   type: string
 *               certNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               registerId:
 *                 type: string
 *               requestCode:
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
  '/request/:requestCode',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Templates],
      isHead: true,
    },
    {
      name: 'dids',
      validate: [Constants.VALIDATION_TYPES.IS_ARRAY],
    },
    {
      name: 'certNames',
      validate: [Constants.VALIDATION_TYPES.IS_ARRAY],
    },
    {
      name: 'registerId',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  template.createRequestByCode,
);

/**
 * @openapi
 *   /template/:{id}/qr/:{requestCode}/:{registerId}:
 *   get:
 *     summary: Genera un QR para pedir info de participante para un template en particular.
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
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *       - name: registerId
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
  '/:id/qr/:requestCode/:registerId',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Templates],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  template.createRequestByTemplateId,
);

module.exports = router;
