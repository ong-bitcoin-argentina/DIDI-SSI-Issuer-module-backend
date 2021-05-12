/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ProfileService = require('../../services/ProfileService');

const readAll = async (req, res) => {
  try {
    const profiles = await ProfileService.getAllProfiles();
    return ResponseHandler.sendRes(res, profiles);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
