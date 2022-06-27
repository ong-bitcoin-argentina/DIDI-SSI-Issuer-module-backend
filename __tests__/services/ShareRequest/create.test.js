const mongoose = require('mongoose');

const { create } = require('../../../services/ShareRequestService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingClaims, missingName } = require('../../../constants/serviceErrors');
const {
  claims, name, invalidClaims, registerId,
} = require('./constants');
const Messages = require('../../../constants/Messages');

describe('services/ShareRequest/create.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });

  test('Expect create to throw on missing name', async () => {
    try {
      await create(undefined, claims);
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing claims', async () => {
    try {
      await create(name, undefined);
    } catch (e) {
      expect(e.code).toMatch(missingClaims.code);
    }
  });

  test('Expect create to success', async () => {
    const shareReq = await create(name, claims, registerId);
    expect(shareReq).toBeDefined();
    expect.stringContaining(shareReq.name);
    expect.objectContaining(shareReq.claims);
  });

  test('Expect create to throw on invalid cert categorie', async () => {
    try {
      await create(name, invalidClaims, registerId);
    } catch (e) {
      expect(e.code).toMatch(Messages.SHARE_REQ.ERR.CERT_TYPES.code);
    }
  });
});
