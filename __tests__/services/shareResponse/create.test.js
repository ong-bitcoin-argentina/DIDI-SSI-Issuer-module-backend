const mongoose = require('mongoose');
const ShareResponse = require('../../../models/ShareResponse');

const { create } = require('../../../services/ShareResponseService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingShareResp } = require('../../../constants/serviceErrors');
const { shareRespJWT } = require('./constants');

describe('services/ShareRequest/create.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
  });
  afterAll(async () => {
    await ShareResponse.findOneAndDelete(shareRespJWT);
    await mongoose.connection.close();
  });

  test('Expect create to create', async () => {
    const res = await create(shareRespJWT);
    expect(res.jwt).toBe(shareRespJWT);
  });

  test('Expect create to throw missing shareResp', async () => {
    try {
      await create(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingShareResp.code);
      expect(e.message).toMatch(missingShareResp.message);
    }
  });
});
