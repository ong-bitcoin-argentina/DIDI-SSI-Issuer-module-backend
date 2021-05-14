/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const Messages = require('../../constants/Messages');

const createByTemplateId = async (req, res) => {
  const { requestCode } = req.params;
  const { templateId } = req.params;
  const jwt = req.body.access_token;

  try {
    // decodificar pedido
    const data = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);

    let name;
    const dataElems = [];

    const { own } = data.payload;
    // extraer info para cada uno de los campos recibidos
    for (const key of Object.keys(own)) {
      const val = own[key];
      if (key === 'FULL NAME' && val) {
        name = val;
      } else if (key && val) dataElems.push({ name: key, value: val });
    }

    // guardar info en bd local
    const participant = await ParticipantService.create(name, data.payload.iss, dataElems, templateId, requestCode);
    return ResponseHandler.sendRes(res, participant);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createByTemplateId,
};
