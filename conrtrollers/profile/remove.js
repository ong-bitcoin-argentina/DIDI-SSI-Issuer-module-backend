/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ProfileService = require('../../services/ProfileService');

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await ProfileService.delete(id);
    return ResponseHandler.sendRes(res, profile);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  remove,
};
