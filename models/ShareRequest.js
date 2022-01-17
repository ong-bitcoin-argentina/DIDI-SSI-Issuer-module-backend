/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const ClaimsData = require('./dataTypes/ClaimsData');
const { CERT_CATEGORIES } = require('../constants/Constants');
const Messages = require('../constants/Messages');

const ShareRequestSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  claims: {
    verifiable: {
      type: Object,
      of: ClaimsData,
    },
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const ShareRequest = mongoose.model('ShareRequest', ShareRequestSchema);
module.exports = ShareRequest;

ShareRequest.generate = async function generate(name, claims) {
  let shareRequest = new ShareRequest();
  shareRequest.claims = { verifiable: {} };
  const claimsEntries = claims.entries();

  try {
    for (const [key, value] of claimsEntries) {
      if (!CERT_CATEGORIES.includes(key)) throw Messages.SHARE_REQ.ERR.CERT_TYPES;
      shareRequest.claims.verifiable[key] = value;
    }

    shareRequest.name = name;
    shareRequest = await shareRequest.save();

    return Promise.resolve(shareRequest);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getAll = async function getAll() {
  try {
    const shareRequests = await ShareRequest.find({}).sort({ createdOn: -1 });
    return Promise.resolve(shareRequests);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getById = async function getById(id) {
  try {
    const query = { _id: id };
    const shareRequest = await ShareRequest.findOne(query);
    if (!shareRequest) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

    return Promise.resolve(shareRequest);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.remove = async function remove(id) {
  try {
    const shareRequest = await ShareRequest.findOne({ _id: id });
    if (!shareRequest) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

    return shareRequest.delete();
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.SHARE_REQ.ERR.DELETE);
  }
};
