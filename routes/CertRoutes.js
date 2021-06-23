/* eslint-disable max-len */
const router = require('express').Router();
const cert = require('../controllers/cert');
const Validator = require('./utils/Validator');
const Constants = require('../constants/Constants');
const { CERT_REVOCATION, TOKEN_VALIDATION } = require('../constants/Validators');

const { checkValidationResult, validate } = Validator;

/**
 * @openapi
 *   /cert/all:
 *   get:
 *     summary: Obtener la lista con info de los certificados generados por el issuer
 *     description: La lista se muestra en una tabla de certificados
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
  validate([TOKEN_VALIDATION.Read_Certs]),
  checkValidationResult,
  cert.readAll,
);

/**
 * @openapi
 *   /cert/find:
 *   get:
 *     summary: Listar certificados emitidos
 *     description: Si se ingresa una fecha en el campo emmited, devuelve los certificados emitidos en dicha fecha. Si se ingresa la variable revoke, devuelve los certificados revocados. No se deben ingresar ambos parametros.
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: emmited
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: revoked
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/find',
  validate([TOKEN_VALIDATION.Read_Certs]),
  checkValidationResult,
  cert.readByQuery,
);

/**
 * @openapi
 *   /cert/{id}:
 *   get:
 *     summary: Retornar un certificado a partir de su id
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
      validate: [Constants.USER_TYPES.Read_Certs],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  cert.readById,
);

/**
 * @openapi
 *   /cert:
 *   post:
 *     summary: Generar un nuevo certificado a partir de la data y el modelo de certificado
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - templateId
 *         - data
 *         - split
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
 *                 type: string
 *               split:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 properties:
 *                   cert:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *                   participant:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           value:
 *                             type: string
 *                   others:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *               microCredentials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     names:
 *                       type: array
 *                       items:
 *                         type: string
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
      validate: [Constants.USER_TYPES.Write_Certs],
      isHead: true,
    },
    { name: 'templateId', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'data',
      validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA],
    },
    {
      name: 'split',
      validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN],
    },
    {
      name: 'microCredentials',
      validate: [Constants.VALIDATION_TYPES.IS_CERT_MICRO_CRED_DATA],
      optional: true,
    },
  ]),
  Validator.checkValidationResult,
  cert.create,
);

/**
 * @openapi
 *   /cert/{id}:
 *   put:
 *     summary: Modifica un certificado con los datos recibidos
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
 *         - templateId
 *         - data
 *         - split
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
 *                 type: string
 *               split:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 properties:
 *                   cert:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *                   participant:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           value:
 *                             type: string
 *                   others:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: string
 *               microCredentials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     names:
 *                       type: array
 *                       items:
 *                         type: string
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
      validate: [Constants.USER_TYPES.Write_Certs],
      isHead: true,
    },
    { name: 'templateId', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    {
      name: 'data',
      validate: [Constants.VALIDATION_TYPES.IS_CERT_DATA],
    },
    {
      name: 'split',
      validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN],
    },
    {
      name: 'microCredentials',
      validate: [Constants.VALIDATION_TYPES.IS_CERT_MICRO_CRED_DATA],
      optional: true,
    },
  ]),
  Validator.checkValidationResult,
  cert.updateById,
);

/**
 * @openapi
 *   /cert/{id}:
 *   delete:
 *     summary: Marca un certificado como borrado y lo revoca en caso de haber sido emitido
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
 *         - reason
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
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
  validate(CERT_REVOCATION),
  checkValidationResult,
  cert.updateById,
);

/**
 * @openapi
 *   /cert/{id}/emmit:
 *   post:
 *     summary: Dado un id enviar certificado a didi-server para ser emitido
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
router.post(
  '/:id/emmit',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_Certs],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  cert.emmitById,
);

/**
 * @openapi
 *   /cert/updateAllDeleted:
 *   post:
 *     summary: Actualizar el estado de los certificados eliminados(deleted=true) a un estado de revocados (revocation= fecha de emisión)
 *     description: Usar con precaución
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
router.post(
  '/updateAllDeleted',
  validate([TOKEN_VALIDATION.Write_Certs]),
  checkValidationResult,
  cert.updateDeleted,
);

module.exports = router;
