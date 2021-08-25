const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { generate } = require('../../../models/Register');
const { data } = require('./constants');

describe('models/Register/generate.test.js', () => {
  const {
    did, name, description, key, imageId, errMsj,
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
    await mongoose.connection.db.dropCollection('registers');
    await mongoose.connection.close();
  });

  test('Expect generate to success', async () => {
    const response = await generate(did, key, name, description, imageId);
    expect(response.did).toMatch(did);
  });

  test('Expect generate to throw error on existent did', async () => {
    try {
      await generate(did, key, name, description, imageId);
    } catch (error) {
      expect(error.toString()).toBe(errMsj);
    }
  });
});
