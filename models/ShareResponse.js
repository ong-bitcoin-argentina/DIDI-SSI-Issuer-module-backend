/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const ShareResponseSchema = mongoose.Schema({
  jwt: {
    type: String,
    required: true,
  },
  process_status: {
    type: String,
    enum: Object.keys(Constants.SHARERESPONSE_PROCESS_STATUS),
  },
  errorMessage: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

// edit ShareResponse
ShareResponseSchema.methods.edit = async function edit(body) {
  // eslint-disable-next-line no-underscore-dangle
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: body,
  };

  try {
    // eslint-disable-next-line no-use-before-define
    return await ShareResponse.findOneAndUpdate(updateQuery, updateAction);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const ShareResponse = mongoose.model('ShareResponse', ShareResponseSchema);
module.exports = ShareResponse;

ShareResponse.generate = async function generate(jwt) {
  let shareResponse = new ShareResponse();
  shareResponse.jwt = jwt;
  shareResponse.process_status = Constants.SHARERESPONSE_PROCESS_STATUS.RECEIVED;

  try {
    shareResponse = await shareResponse.save();

    return Promise.resolve(shareResponse);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareResponse.getById = async function getById(id) {
  try {
    const query = { _id: id };
    const shareResponse = await ShareResponse.findOne(query);
    if (!shareResponse) throw Messages.SHARE_RES.ERR.NOT_EXIST;

    return Promise.resolve(shareResponse);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
