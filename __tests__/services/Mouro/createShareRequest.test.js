jest.mock('node-fetch');
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const { createShareRequest } = require('../../../services/MouroService');
const { newRegister } = require('../../../services/RegisterService');
const { decodeJWT } = require('../../../services/BlockchainService');

const { MONGO_URL } = require('../../../constants/Constants');
const { missingClaims, missingCb, missingRegisterId } = require('../../../constants/serviceErrors');
const { data, successResp } = require('./constants');

describe('services/Mouro/createShareRequest.test.js', () => {
  const {
    did, privateKey, name, token,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('registers');
    await mongoose.connection.close();
  });
  test('Expect createShareRequest to throw on missing claims', async () => {
    try {
      await createShareRequest(undefined, 'cb', 'registerID');
    } catch (e) {
      expect(e.code).toMatch(missingClaims.code);
    }
  });

  test('Expect createShareRequest to throw on missing cb', async () => {
    try {
      await createShareRequest('claims', undefined, 'registerID');
    } catch (e) {
      expect(e.code).toMatch(missingCb.code);
    }
  });

  test('Expect createShareRequest to throw on missing registerId', async () => {
    try {
      await createShareRequest('claims', 'cb', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  test('Expect createShareRequest to throw success', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    const { _id: registerId } = await newRegister(did, privateKey, name, token, 'description');
    const response = await createShareRequest({ claims: 'test' }, 'cb', registerId);
    const { payload } = await decodeJWT(response);
    expect(payload.iss).toBe(did);
    expect(payload.type).toBe('shareReq');
  });
});
