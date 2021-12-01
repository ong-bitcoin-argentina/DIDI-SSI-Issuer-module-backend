jest.mock('node-fetch');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { newRegister } = require('../../../services/RegisterService');
const {
  missingDid, missingName, missingDescription, missingKey, missingToken,
} = require('../../../constants/serviceErrors');
const { data, errors, successResp } = require('./constants');

describe('services/Register/newRegister.test.js', () => {
  const {
    did,
    name,
    description,
    token,
    key,
    file,
    secondDidKey,
    secondDid,
    secondName,
    thirdDid,
    thirdDidKey,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('registers');
    await mongoose.connection.db.dropCollection('images');
    await mongoose.connection.close();
  });

  test('Expect newRegister to throw on missing did', async () => {
    try {
      await newRegister(undefined, 'key', 'name', 'token', 'description', 'file');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect newRegister to throw on missing key', async () => {
    try {
      await newRegister('did', undefined, 'name', 'token', 'description', 'file');
    } catch (e) {
      expect(e.code).toMatch(missingKey.code);
    }
  });

  test('Expect newRegister to throw on missing name', async () => {
    try {
      await newRegister('did', 'key', undefined, 'token', 'description', 'file');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect newRegister to throw on missing token', async () => {
    try {
      await newRegister('did', 'key', 'name', undefined, 'description', 'file');
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect newRegister to throw on missing description', async () => {
    try {
      await newRegister('did', 'key', 'name', 'token', undefined, 'file');
    } catch (e) {
      expect(e.code).toMatch(missingDescription.code);
    }
  });

  test('Expect newRegister to success without image', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    const response = await newRegister(did, key, name, token, description);
    expect(response.status).toBe('Creando');
    expect(response.did).toBe(did);
  });

  test('Expect newRegister to throw on existing did', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    try {
      await newRegister(did, key, name, token, description);
    } catch (e) {
      expect(e.code).toMatch(errors.did.code);
      expect(e.message).toMatch(errors.did.message);
    }
  });

  test('Expect newRegister to success with image', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    const response = await newRegister(
      secondDid, secondDidKey, secondName, token, description, file,
    );
    expect(response.status).toBe('Creando');
    expect(response.did).toBe(secondDid);
  });

  test('Expect newRegister to throw on existing name', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    try {
      await newRegister(thirdDid, thirdDidKey, name, token, description);
    } catch (e) {
      expect(e.code).toMatch(errors.name.code);
      expect(e.message).toMatch(errors.name.message);
    }
  });
});
