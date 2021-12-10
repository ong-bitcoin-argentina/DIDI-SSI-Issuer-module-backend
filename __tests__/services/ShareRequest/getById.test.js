const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingId } = require('../../../constants/serviceErrors');
const { claims, name } = require('./constants');
const { create, getById } = require('../../../services/ShareRequestService');
const Messages = require('../../../constants/Messages');

describe('services/ShareRequest/getById.test.js', () => {
  let shareReqId;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    shareReqId = await create(name, claims);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });

  test('Expect getById to throw on missing id', async () => {
    try {
      await getById(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect getById to success', async () => {
    const shareReq = await getById(shareReqId);
    expect(shareReq).toBeDefined();
    expect.stringContaining(shareReq.name);
    expect.objectContaining(shareReq.claims);
  });

  test('Expect getById to throw on invalid unexistent id', async () => {
    const id = new mongoose.Types.ObjectId();
    try {
      await getById(id);
    } catch (e) {
      expect(e.code).toMatch(Messages.SHARE_REQ.ERR.NOT_EXIST.code);
    }
  });
});
