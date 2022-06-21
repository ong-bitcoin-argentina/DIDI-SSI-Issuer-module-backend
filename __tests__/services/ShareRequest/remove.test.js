const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingId } = require('../../../constants/serviceErrors');
const { claims, name, registerId } = require('./constants');
const { remove, create } = require('../../../services/ShareRequestService');
const Messages = require('../../../constants/Messages');

describe('services/ShareRequest/remove.test.js', () => {
  let shareReqId;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    shareReqId = await create(name, claims, registerId);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });

  test('Expect remove to throw on missing id', async () => {
    try {
      await remove(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect remove to success', async () => {
    const shareReq = await remove(shareReqId);
    expect(shareReq).toBeDefined();
    expect.stringContaining(shareReq.name);
    expect.objectContaining(shareReq.claims);
  });

  test('Expect remove to throw on invalid unexistent id', async () => {
    try {
      await remove(shareReqId);
    } catch (e) {
      expect(e.code).toMatch(Messages.SHARE_REQ.ERR.DELETE.code);
    }
  });
});
