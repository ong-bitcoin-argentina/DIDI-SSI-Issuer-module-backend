/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
const MouroService = require('../../services/MouroService');
const Constants = require('../../constants/Constants');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const createRequestByCode = async (req, res) => {
  const {
    dids, certNames, requestCode, registerId,
  } = req.body;

  try {
    // llamar al metodo '/participant/${requestCode}' con el resultado
    const cb = `${Constants.ADDRESS}:${Constants.PORT}/participant/${requestCode}`;
    const verifiable = {};

    // pedir todos los certificados en 'certNames' a los usuarios cuyos dids se correspondan con 'dids'
    for (const certName of certNames) {
      verifiable[certName] = null;
    }

    const claims = {
      verifiable,
      user_info: { 'FULL NAME': { essential: true } },
    };
    const result = await MouroService.createShareRequest(claims, cb, registerId);

    // un pedido para cada usuario
    for (const did of dids) await MouroService.sendShareRequest(did, result, registerId);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createRequestByCode,
};
