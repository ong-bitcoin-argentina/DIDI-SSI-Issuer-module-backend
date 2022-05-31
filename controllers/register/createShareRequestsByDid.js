const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareRequestService = require('../../services/ShareRequestService');
const { sendShareReqToDidi } = require('../../services/RegisterService');
const { createJWT } = require('../../services/BlockchainService');
const Register = require('../../models/Register');
const { DIDI_SERVER_DID } = require('../../constants/Constants');

const createShareRequestsByDid = async (req, res) => {
  try {
    const { claims, name, callback } = req.body;
    const { did } = req.params;

    const claimsMap = new Map(claims);

    // Guardar el modelo de pedido de certificados
    const shareReq = await ShareRequestService.create(name, claimsMap);

    // Obtener el emisor a asociar con el modelo y completar el payload
    const register = await Register.getByDID(did);
    const payload = {
      name,
      callback,
      type: 'shareReq',
      claims: shareReq.claims,
    };

    // Finalizar creacion de modelo
    const jwt = await createJWT(register.did, register.private_key, payload, undefined, DIDI_SERVER_DID);

    // Enviar modelo a didi-server para asociarlo con el emisor
    await sendShareReqToDidi(did, jwt);

    return ResponseHandler.sendRes(res, jwt);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  createShareRequestsByDid,
};
