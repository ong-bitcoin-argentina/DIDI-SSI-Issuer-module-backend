/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const CertService = require('../../services/CertService');
const { toDTO } = require('../../routes/utils/CertDTO');

const readAll = async (_, res) => {
  try {
    const certs = await CertService.getAll();
    const result = toDTO(certs);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
