/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const { ObjectId } = mongoose;

const ClaimsData = require('./dataTypes/ClaimsData');
const { CERT_CATEGORIES } = require('../constants/Constants');
const Messages = require('../constants/Messages');

const populateRegister = {
  path: 'registerId',
  select: {
    id: 1, name: 1, did: 1, status: 1,
  },
  model: 'Register',
};

const ShareRequestSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  claims: {
    verifiable: {
      type: Object,
      of: ClaimsData,
    },
  },
  registerId: {
    type: ObjectId,
    required: true,
    ref: 'Register',
  },
  referenceServerRequestId: {
    type: ObjectId,
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const ShareRequest = mongoose.model('ShareRequest', ShareRequestSchema);
module.exports = ShareRequest;

ShareRequest.generate = async function generate(name, claims, registerId) {
  let shareRequest = new ShareRequest();
  shareRequest.claims = { verifiable: {} };
  const claimsEntries = claims.entries();

  try {
    for (const [key, value] of claimsEntries) {
      if (!CERT_CATEGORIES.includes(key)) throw Messages.SHARE_REQ.ERR.CERT_TYPES;
      shareRequest.claims.verifiable[key] = value;
    }

    shareRequest.name = name;
    shareRequest.registerId = registerId;
    shareRequest = await shareRequest.save();

    return Promise.resolve(shareRequest);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getAll = async function getAll() {
  try {
    const shareRequests = await ShareRequest.find({}).populate(populateRegister).sort({
      createdOn: -1,
    });
    return Promise.resolve(shareRequests);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getById = async function getById(id) {
  try {
    const query = { _id: id };
    const shareRequest = await ShareRequest.findOne(query).populate(populateRegister);
    if (!shareRequest) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

    return Promise.resolve(shareRequest);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getByServerId = async function getByServerId(id) {
  try {
    const query = { referenceServerRequestId: id };
    const shareRequest = await ShareRequest.findOne(query).populate(populateRegister);
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
