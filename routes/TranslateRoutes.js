const router = require('express').Router();
const translate = require('../controllers/translate');

/**
 * @openapi
 *   /translate:
 *   get:
 *     summary: Obtiene una lista con la informacion de los translate
 *     tags:
 *       - translate
 *     parameters:
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
  translate.readAll,
);

module.exports = router;
