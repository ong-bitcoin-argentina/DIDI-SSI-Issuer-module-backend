const router = require('express').Router();
const Constants = require('../constants/Constants');
const Validator = require('./utils/Validator');
const shareRequest = require('../controllers/shareRequest/index');

/**
 * @openapi
 *   /shareRequest:
 *   post:
 *     summary: Manda un shareRequest a didi-server para ser guardado
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - name
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
  '/',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Write_ShareRequest],
      isHead: true,
    },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'claims', validate: [Constants.VALIDATION_TYPES.IS_ARRAY] },
  ]),
  Validator.checkValidationResult,
  shareRequest.create,
);

/**
 * @openapi
 *   /shareRequest/all:
 *   get:
 *     summary: Obtiene una lista con la informacion de los shareRequest
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
      validate: [Constants.USER_TYPES.Read_ShareRequest],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  shareRequest.readAll,
);

/**
 * @openapi
 *   /shareRequest/{id}:
 *   get:
 *     summary: Devuelve un shareRequest dado un id.
 *     parameters:
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
  shareRequest.readById,
);

/**
 * @openapi
 *   /shareRequest/{id}:
 *   delete:
 *     summary: Elimina un shareRequest segun su id
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
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
  '/:id',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Delete_ShareRequest],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  shareRequest.deleteById,
);

module.exports = router;
