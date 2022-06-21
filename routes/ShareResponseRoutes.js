const router = require('express').Router();
const Constants = require('../constants/Constants');
const Validator = require('./utils/Validator');
const shareResponse = require('../controllers/shareResponse');
const { halfHourLimiter } = require('../policies/RateLimit');

/**
 * @openapi
 *   /shareResponse/{did}:
 *   post:
 *     summary: Recibe un shareResponse para ser guardado
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
 *         - jwt
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               jwt:
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
  '/:did',
  Validator.validateUserToken,
  Validator.validate([
    { name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  shareResponse.create,
);

module.exports = router;
