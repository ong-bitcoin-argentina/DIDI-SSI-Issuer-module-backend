/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const Messages = require('../../constants/Messages');

const createByRequestCode = async (req, res) => {
  const { requestCode } = req.params;
  const jwt = req.body.access_token;

  try {
    // decodificar pedido
    const cert = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);

    const name = cert.payload.own['FULL NAME'];
    const dataElems = [];

    // por cada certificado pedido
    for (const payload of cert.payload.verified) {
      // decodificarlo
      const reqData = await MouroService.decodeCertificate(payload, Messages.CERTIFICATE.ERR.VERIFY);
      const subject = reqData.payload.vc.credentialSubject;
      // extraer info
      for (const i of Object.keys(subject)) {
        const { data } = subject[i];
        for (const dataKey of Object.keys(data)) {
          const dataValue = data[dataKey];
          const key = dataKey.toLowerCase() === 'phonenumber' ? 'Phone' : dataKey;
          if (dataKey && dataValue) dataElems.push({ name: key, value: dataValue });
        }
      }
    }
    // guardar info en bd local
    const participant = await ParticipantService.create(name, cert.payload.iss, dataElems, undefined, requestCode);
    return ResponseHandler.sendRes(res, participant);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createByRequestCode,
};
