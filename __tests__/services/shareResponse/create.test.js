const mongoose = require('mongoose');
const ShareResponse = require('../../../models/ShareResponse');

const { create } = require('../../../services/ShareResponseService');
const ShareRequestService = require('../../../services/ShareRequestService');
const RegisterModel = require('../../../models/Register');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingShareResp } = require('../../../constants/serviceErrors');
const { validShareResponse, invalidShareResponse } = require('./constants');
const {
  claims, name, registerId,
} = require('../ShareRequest/constants');

describe('services/ShareResponse/create.test.js', () => {
  let shareReq;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    shareReq = await ShareRequestService.create(name, claims, registerId);
  });
  afterAll(async () => {
    await ShareResponse.findOneAndDelete(validShareResponse);
    await mongoose.connection.close();
  });

  test('Expect create to create', async () => {
    RegisterModel.getById = ((id) => Promise.resolve({ did: id }));
    const res = await create(validShareResponse, shareReq.id);
    expect(res.jwt).toBe(validShareResponse);
  });

  test('Expect create to throw invalid JWT', async () => {
    try {
      await create(invalidShareResponse, shareReq.id);
    } catch (e) {
      expect(e.status).toBe(false);
      expect(e.errors).not.toBeNull();
    }
  });

  test('Expect create to throw missing shareResp', async () => {
    try {
      await create(undefined, shareReq.id);
    } catch (e) {
      expect(e.code).toMatch(missingShareResp.code);
      expect(e.message).toMatch(missingShareResp.message);
    }
  });
});
