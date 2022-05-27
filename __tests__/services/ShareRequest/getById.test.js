const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingId } = require('../../../constants/serviceErrors');
const { claims, name } = require('./constants');
const { create, getById } = require('../../../services/ShareRequestService');
const Messages = require('../../../constants/Messages');
const { newRegister } = require('../../../services/RegisterService');
const { data } = require('../Register/constants');

describe('services/ShareRequest/getById.test.js', () => {
  const {
    fifthDid, name: registerName, description, token, fifthDidKey, file,
  } = data;
  let shareReqId;
  let registerId;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    registerId = await newRegister(fifthDid, fifthDidKey, registerName, token, description, file);
    shareReqId = await create(name, claims, registerId);
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
    expect.objectContaining(shareReq.registerId);
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
