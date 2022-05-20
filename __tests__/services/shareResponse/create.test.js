const mongoose = require('mongoose');

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
    await mongoose.connection.db.dropCollection('shareResponse');
    await mongoose.connection.close();
  });

  test('Expect create to create', async () => {
    const res = await create(shareRespJWT);
    expect(res.shareResp).toBe(shareRespJWT);
  });

  test('Expect create to throw missing shareResp', async () => {
    try {
      await create(shareRespJWT);
    } catch (e) {
      expect(e.code).toMatch(missingShareResp);
    }
  });
});
