/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const Register = require('../../../models/Register');
const { data } = require('./constants');

describe('models/Register/generate.test.js', () => {
  const {
    did, name, description, key, imageId,
  } = data;
  let newRegister;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    newRegister = await Register.generate(did, key, name, description, imageId);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('registers');
    await mongoose.connection.close();
  });

  test('Expect generate to success', async () => {
    const register = await Register.findOne({ _id: newRegister._id });
    const response = await register.edit({ name: 'Nuevo nombre' });
    expect(response.did).toMatch(did);
    expect(response.name).toMatch('Nuevo nombre');
  });

  test('Expect generate to success with description undefined', async () => {
    const register = await Register.findOne({ _id: newRegister._id });
    const response = await register.edit({ name, description: undefined });
    expect(response.did).toMatch(did);
    expect(response.name).toMatch(name);
    expect(response.description).toMatch(description);
  });
});
