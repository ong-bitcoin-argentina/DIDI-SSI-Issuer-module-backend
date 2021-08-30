const router = require('express').Router();
const Validator = require('./utils/Validator');
const image = require('../controllers/image/index');
const Constants = require('../constants/Constants');

/**
 * @openapi
 *   /image/{id}:
 *   get:
 *     summary: Devuelve una imagen dado un id.
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
      validate: [Constants.USER_TYPES.Write_Dids_Registers],
      isHead: true,
    },
  ]),
  Validator.checkValidationResult,
  image.readImageById,
);

module.exports = router;
