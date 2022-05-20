/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const Messages = require('../constants/Messages');

// toDo:check if we have to save other properties
const ShareResponseSchema = mongoose.Schema({
  shareResp: {
    type: String,
    require: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const ShareResponse = mongoose.model('ShareResponse', ShareResponseSchema);
module.exports = ShareResponse;

ShareResponse.generate = async function generate(shareResp) {
  let shareResponse = new ShareResponse();
  shareResponse.shareResp = shareResp;

  try {
    // toDo: validate vc keys
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
