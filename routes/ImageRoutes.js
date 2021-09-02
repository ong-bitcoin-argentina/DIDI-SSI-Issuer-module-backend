const router = require('express').Router();
const Constants = require('../constants/Constants');
const Validator = require('./utils/Validator');
const image = require('../controllers/image/index');

/**
 * @openapi
 *   /image:
 *   post:
 *     summary: Guarda una imagen en la base de datos y devuelve su id
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - file
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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

  ]),
  Validator.checkValidationResult,
  Validator.validateFile,
  image.create,
);

/**
 * @openapi
 *   /image/{id}:
 *   get:
 *     summary: Devuelve una imagen dado un id.
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
  image.readById,
);

/**
 * @openapi
 *   /image/{id}:
 *   patch:
 *     summary: Editar una imagen
 *     description: Actualiza una imagen en la base de datos segun su id
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
 *         - file
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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
router.patch(
  '/:id',
  Validator.validate([
    {
      name: 'token',
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  Validator.validateFile,
  image.updateById,
);

/**
 * @openapi
 *   /image/{id}:
 *   delete:
 *     summary: Elimina una imagen segun su id
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
      validate: [Constants.USER_TYPES.Admin],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  image.deleteById,
);

module.exports = router;
