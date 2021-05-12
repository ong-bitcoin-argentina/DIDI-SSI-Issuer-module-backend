/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ProfileService = require('../../services/ProfileService');

const create = async (req, res) => {
  try {
    const profile = await ProfileService.createProfile(req.body);
    return ResponseHandler.sendRes(res, profile);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
