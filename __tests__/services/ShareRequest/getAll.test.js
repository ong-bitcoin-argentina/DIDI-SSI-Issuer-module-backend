/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const { create, getAll } = require('../../../services/ShareRequestService');
const { MONGO_URL } = require('../../../constants/Constants');
const { claims, name } = require('./constants');

describe('services/ShareRequest/getAll.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL);
    for (let i = 0; i < 5; i++) {
      await create(name, claims);
    }
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });

  test('Expect getAll to success', async () => {
    const shareReqList = await getAll();
    expect.arrayContaining(shareReqList);
    expect(shareReqList.length).toBe(5);
  });
});
