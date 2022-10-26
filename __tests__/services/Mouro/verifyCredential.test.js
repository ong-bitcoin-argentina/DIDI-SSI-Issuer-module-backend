jest.mock('node-fetch');
const fetch = require('node-fetch');

const { missingJwt } = require('../../../constants/serviceErrors');
const { verifyCredential } = require('../../../services/MouroService');
const { successRespVerifyCred, dataVerifyCred } = require('./constants');

describe('services/Mouro/verifyCredential.test.js', () => {
  test('Expect verifyCredential to throw on missing jwt', async () => {
    try {
      await verifyCredential(undefined);
    } catch (error) {
      expect(error).toBe(missingJwt);
    }
  });
  test('Expect verifyCredential to throw on missing jwt', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successRespVerifyCred),
    );
    const result = await verifyCredential(dataVerifyCred);
    expect(result).toBe(successRespVerifyCred.json().data);
  });
});
