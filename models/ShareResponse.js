/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { ObjectId } = mongoose;
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const populateShareRequest = {
  path: 'shareRequestId',
  select: {
    id: 1, name: 1, registerId: 1,
  },
  model: 'ShareRequest',
};

const ShareResponseSchema = mongoose.Schema({
  jwt: {
    type: String,
    required: true,
  },
  shareRequestId: {
    type: ObjectId,
    required: true,
    ref: 'ShareRequest',
  },
  iss: {
    type: String,
  },
  process_status: {
    type: String,
    enum: Object.values(Constants.SHARERESPONSE_PROCESS_STATUS),
  },
  errorMessage: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

ShareResponseSchema.plugin(AutoIncrement, { inc_field: 'id' });

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

ShareResponse.generate = async function generate(jwt, shareRequestId, iss) {
  let shareResponse = new ShareResponse();
  shareResponse.jwt = jwt;
  shareResponse.process_status = Constants.SHARERESPONSE_PROCESS_STATUS.RECEIVED;
  shareResponse.shareRequestId = shareRequestId;
  shareResponse.iss = iss;
  shareResponse.createdOn = Date.now();

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
    const shareResponse = await ShareResponse.findOne(query).populate(populateShareRequest);
    if (!shareResponse) throw Messages.SHARE_RES.ERR.NOT_EXIST;

    return Promise.resolve(shareResponse);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareResponse.getByDID = async function getByDID(did) {
  try {
    const query = { iss: did };
    populateShareRequest.match = query;
    const shareResponse = await ShareResponse.findOne({}).populate(populateShareRequest);
    if (!shareResponse) throw Messages.SHARE_RES.ERR.NOT_EXIST;

    return Promise.resolve(shareResponse);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

ShareResponse.getAll = async function getAll() {
  try {
    const ShareResponses = await ShareResponse.find({})
      .populate(populateShareRequest).sort({ createdOn: -1 });
    return Promise.resolve(ShareResponses);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
