const router = require('express').Router();
const image = require('../controllers/image/index');

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
  image.readImageById,
);

module.exports = router;
