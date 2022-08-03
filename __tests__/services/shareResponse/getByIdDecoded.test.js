const mongoose = require('mongoose');
const ShareResponse = require('../../../models/ShareResponse');

const { MONGO_URL } = require('../../../constants/Constants');
const { missingId } = require('../../../constants/serviceErrors');
const { validShareResponse } = require('./constants');
const { create, getByIdDecoded } = require('../../../services/ShareResponseService');
const ShareRequestService = require('../../../services/ShareRequestService');
const Messages = require('../../../constants/Messages');
const {
  claims, name, registerId,
} = require('../ShareRequest/constants');

describe('services/ShareRequest/getByIdDecoded.test.js', () => {
  let shareResp;
  let shareReq;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    shareReq = await ShareRequestService.create(name, claims, registerId);
    shareResp = await create(validShareResponse, shareReq.id);
  });
  afterAll(async () => {
    await ShareResponse.findOneAndDelete(validShareResponse);
    await mongoose.connection.close();
  });

  test('Expect getByIdDecoded to throw on missing id', async () => {
    try {
      await getByIdDecoded(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
      expect(e.message).toMatch(missingId.message);
    }
  });

  test('Expect getByIdDecoded to success', async () => {
    const shareResponse = await getByIdDecoded(shareResp.id);
    expect(shareResponse).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(shareResponse._id.toString()).toBe(shareResp.id);
    expect(shareResp.shareResp).toBe(shareResp.shareResp);
  });

  test('Expect getByIdDecoded to throw on invalid unexistent id', async () => {
    const id = new mongoose.Types.ObjectId();
    try {
      await getByIdDecoded(id);
    } catch (e) {
      expect(e.code).toMatch(Messages.SHARE_RES.ERR.NOT_EXIST.code);
    }
  });
});
