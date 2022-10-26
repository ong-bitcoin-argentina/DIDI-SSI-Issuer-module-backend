const mongoose = require('mongoose');
const ShareResponse = require('../../../models/ShareResponse');
const Register = require('../../../models/Register');

const { MONGO_URL } = require('../../../constants/Constants');
const { validShareResponse } = require('./constants');
const { create, getAll, getByDID } = require('../../../services/ShareResponseService');
const ShareRequestService = require('../../../services/ShareRequestService');
const { newRegister } = require('../../../services/RegisterService');
const {
  claims, name,
} = require('../ShareRequest/constants');
const { data } = require('../Register/constants');

describe('services/ShareRequest/getAll.test.js', () => {
  let shareReq;
  let registerId;
  let shareResp;
  const {
    fourthDid, name: registerName, description, token, fourthDidKey, file,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    try {
      const register = await Register.getByDID(fourthDid);
      registerId = register.id;
    } catch (error) {
      registerId = await newRegister(
        fourthDid, fourthDidKey, registerName, token, description, file,
      );
    }
    shareReq = await ShareRequestService.create(name, claims, registerId);
    // eslint-disable-next-line no-underscore-dangle
    await ShareRequestService.setRefId(shareReq._id, shareReq._id);
    shareResp = await create(validShareResponse, shareReq.id);
  });
  afterAll(async () => {
    await ShareResponse.findOneAndDelete(validShareResponse);
    await mongoose.connection.close();
  });

  test('Expect getAll to success', async () => {
    const shareRespList = await getAll();
    expect.arrayContaining(shareRespList);
    expect(shareRespList.length).toBe(1);
  });

  test('Expect getByDID to success', async () => {
    const shareResponse = await getByDID(fourthDid);
    expect(shareResponse).toBeDefined();
    expect(shareResponse.id).toBe(shareResp.id);
  });
});
