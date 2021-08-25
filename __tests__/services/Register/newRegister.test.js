const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { newRegister } = require('../../../services/RegisterService');
const {
  missingDid, missingName, missingDescription, missingKey, missingToken,
} = require('../../../constants/serviceErrors');
const { data } = require('./constants');

describe('services/Register/newRegister.test.js', () => {
  const {
    did, name, description, token, key,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  });
  afterAll(async () => {
    // await revoke(did, token);
    // await mongoose.connection.db.dropCollection('registers');
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

  test.skip('Expect newRegister to success without image', async () => {
    const response = await newRegister(did, key, name, token, description);
    expect(response).not.toBe(null);
  });
});
