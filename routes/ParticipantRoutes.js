/* eslint-disable max-len */
const router = require('express').Router();
const participant = require('../conrtrollers/participant');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');

/**
 * @openapi
 *   /participant/dids:
 *   get:
 *     summary: Retorna los dids y nombres de todos los participantes conocidos.
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
  '/dids',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  participant.readDids,
);

/**
 * @openapi
 *   /participant/global:
 *   get:
 *     summary: Retorna los participantes con informacion no vinculada a un modelo de certificado en particular.
 *     description: Indica que tipo de informacion posee (cual de los certificados).
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
  '/global',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  participant.readAll,
);

/**
 * @openapi
 *   /participant/all/:{templateId}:
 *   get:
 *     summary: Retorna los participantes con informacion vinculada a un modelo de certificado.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - name: templateId
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
  '/all/:templateId',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  participant.readAllByTemplateId,
);

/**
 * @openapi
 *   /participant/new/:{requestCode}:
 *   get:
 *     summary: Retorna la informacion del participante con el codigo indicado, si la data fue modificada.
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
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/new/:requestCode',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Read_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  participant.readByRequestCode,
);

/**
 * @openapi
 *   /participant/:{did}:
 *   get:
 *     summary: Retorna la info de participante asociada a un usuario en particular.
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
      validate: [Constants.USER_TYPES.Read_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  participant.readByDid,
);

/**
 * @openapi
 *   /participant/new/:
 *   post:
 *     summary: Inicializa la data de participante con unicamente el did y nombre.
 *     description: Carga por csv.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - "name"
 *                     - "did"
 *                   properties:
 *                     name:
 *                       type: string
 *                     did:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - "name"
 *                           - "value"
 *                         properties:
 *                             name:
 *                               type: string
 *                             value:
 *                               type: string
 *                     templateId:
 *                       type: string
 *                     requestCode:
 *                       type: string
 *                     new:
 *                       type: boolean
 *                     deleted:
 *                       type: boolean
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/new/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Dids_Registers],
      isHead: true,
    },
    {
      name: 'data',
      validate: [Constants.VALIDATION_TYPES.IS_NEW_PARTICIPANTS_DATA],
    },
  ]),
  Validator.checkValidationResult,
  participant.create,
);

/**
 * @openapi
 *   /participant/:{id}/:
 *   put:
 *     summary: Modifica la data de participante con los datos recibidos.
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
 *         - templateId
 *         - data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - "name"
 *                     - "did"
 *                   properties:
 *                     name:
 *                       type: string
 *                     did:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - "name"
 *                           - "value"
 *                         properties:
 *                             name:
 *                               type: string
 *                             value:
 *                               type: string
 *                     requestCode:
 *                       type: string
 *                     new:
 *                       type: boolean
 *                     deleted:
 *                       type: boolean
 *                     createdOn:
 *                       type: string
 *                       format: date-time
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
      validate: [Constants.USER_TYPES.Write_Dids_Registers],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'data',
      validate: [Constants.VALIDATION_TYPES.IS_PART_DATA],
    },
  ]),
  Validator.checkValidationResult,
  participant.updateById,
);

/**
 * @openapi
 *   /participant/:{id}:
 *   delete:
 *     summary: Marca la data de participante como borrada.
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
      validate: [Constants.USER_TYPES.Write_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  participant.removeById,
);

// -- disclosure requests --

/**
 * @openapi
 *   /participant/:{requestCode}:
 *   post:
 *     summary: Carga de info de participante global a partir de un pedido de certificado realizado con "/template/request/:requestCode".
 *     parameters:
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - access_token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
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
  '/:requestCode',
  Validator.validate([{ name: 'access_token', validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
  Validator.checkValidationResult,
  participant.createByRequestCode,
);

/**
 * @openapi
 *   /participant/:{templateId}/:{requestCode}:
 *   post:
 *     summary: Carga de info de participante para un template en particular a partir del QR generado en "/template/:id/qr/:requestCode".
 *     parameters:
 *       - name: templateId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *       - name: requestCode
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - access_token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
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
  '/:templateId/:requestCode',
  Validator.validate([{ name: 'access_token', validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
  Validator.checkValidationResult,
  participant.createByTemplateId,
);

module.exports = router;
