const mongoose = require('mongoose');
const ShareResponse = require('../../../models/ShareResponse');

const { create } = require('../../../services/ShareResponseService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingShareResp } = require('../../../constants/serviceErrors');
const { validShareResponse, invalidShareResponse } = require('./constants');

describe('services/ShareResponse/create.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
  });
  afterAll(async () => {
    await ShareResponse.findOneAndDelete(validShareResponse);
    await mongoose.connection.close();
  });

  test('Expect create to create', async () => {
    const res = await create(validShareResponse);
    expect(res.jwt).toBe(validShareResponse);
  });

  test('Expect create to throw invalid JWT', async () => {
    try {
      await create(invalidShareResponse);
    } catch (e) {
      expect(e.status).toBe(false);
      expect(e.errors).not.toBeNull();
    }
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
