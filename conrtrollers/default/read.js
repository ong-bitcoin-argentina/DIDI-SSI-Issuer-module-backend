/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const DefaultService = require('../../services/DefaultService');

const read = async (req, res) => {
  try {
    const defaultValue = await DefaultService.get();
    return ResponseHandler.sendRes(res, defaultValue);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  read,
};
