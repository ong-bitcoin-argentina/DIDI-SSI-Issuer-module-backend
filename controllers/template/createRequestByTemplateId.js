/* eslint-disable no-underscore-dangle */
const MouroService = require('../../services/MouroService');
const Constants = require('../../constants/Constants');
const TemplateService = require('../../services/TemplateService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const createRequestByTemplateId = async (req, res) => {
  const { id, requestCode, registerId } = req.params;
  try {
    const template = await TemplateService.getById(id);

    // llamar al metodo 'participant/${templateId}/${requestCode}' con el resultado
    const cb = `${Constants.ADDRESS}:${Constants.PORT}/participant/${template._id}/${requestCode}`;

    const claims = {
      user_info: { 'FULL NAME': { essential: true } },
    };

    // pedir todos los campos que el template requiere del participante
    template.data.participant.forEach((element) => {
      const { name } = element;
      if (name !== 'DID' && name !== 'EXPIRATION DATE') {
        // mapeo los campos conocidos (los de los certificados de tel, mail y data de renaper)
        if (Constants.TYPE_MAPPING[name]) {
          claims.user_info[Constants.TYPE_MAPPING[name]] = null;
        } else {
          claims.user_info[name] = null;
        }
      }
    });

    const cert = await MouroService.createShareRequest(claims, cb, registerId);
    return ResponseHandler.sendRes(res, cert);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createRequestByTemplateId,
};
