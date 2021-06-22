/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const DefaultService = require('../../services/DefaultService');

const update = async (req, res) => {
  try {
    const defaultValue = await DefaultService.editDefault(req.body);
    return ResponseHandler.sendRes(res, defaultValue);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  update,
};
