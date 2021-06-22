/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const DefaultService = require('../../services/DefaultService');

const create = async (req, res) => {
  try {
    const defaultValue = await DefaultService.newDefault(req.body);
    return ResponseHandler.sendRes(res, defaultValue);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
