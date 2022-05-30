const mongoose = require('mongoose');
const ShareResponse = require('../../../models/ShareResponse');

const { MONGO_URL } = require('../../../constants/Constants');
const { missingId } = require('../../../constants/serviceErrors');
const { shareRespJWT } = require('./constants');
const { create, getById } = require('../../../services/ShareResponseService');
const Messages = require('../../../constants/Messages');

describe('services/ShareRequest/getById.test.js', () => {
  let shareResp;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    shareResp = await create(shareRespJWT);
  });
  afterAll(async () => {
    await ShareResponse.findOneAndDelete(shareRespJWT);
    await mongoose.connection.close();
  });

  test('Expect getById to throw on missing id', async () => {
    try {
      await getById(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
      expect(e.message).toMatch(missingId.message);
    }
  });

  test('Expect getById to success', async () => {
    const shareResponse = await getById(shareResp.id);
    expect(shareResponse).toBeDefined();
    expect(shareResponse.id).toBe(shareResp.id);
    expect(shareResp.shareResp).toBe(shareResp.shareResp);
  });

  test('Expect getById to throw on invalid unexistent id', async () => {
    const id = new mongoose.Types.ObjectId();
    try {
      await getById(id);
    } catch (e) {
      expect(e.code).toMatch(Messages.SHARE_RES.ERR.NOT_EXIST.code);
    }
  });
});
