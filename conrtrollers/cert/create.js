/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const CertService = require('../../services/CertService');

const create = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { templateId } = req.body;
    const { split } = req.body;
    const microCredentials = req.body.microCredentials ? req.body.microCredentials : [];

    const result = [];
    for (const participantData of data.participant) {
      let cert;
      const certData = {
        cert: data.cert,
        participant: [participantData],
        others: data.others,
      };

      cert = await CertService.create(certData, templateId, split, microCredentials);
      if (cert) result.push(cert);
    }
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
