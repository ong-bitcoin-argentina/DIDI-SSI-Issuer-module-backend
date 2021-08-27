jest.mock('node-fetch');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { newRegister, editRegister } = require('../../../services/RegisterService');
const { missingDid } = require('../../../constants/serviceErrors');
const { data, successResp } = require('./constants');

describe('services/Register/editRegister.test.js', () => {
  const {
    did, name, description, token, key, file,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    await newRegister(did, key, name, token, description, file);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('registers');
    await mongoose.connection.close();
  });

  test('Expect editRegister to throw on missing did', async () => {
    try {
      await editRegister(undefined, 'body', 'file');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect editRegister to success', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    const newName = 'new name';
    const newDescription = 'new description';
    const response = await editRegister(did, { name: newName, description: newDescription });
    expect(response.name).toMatch(newName);
    expect(response.description).toMatch(newDescription);
  });
});
