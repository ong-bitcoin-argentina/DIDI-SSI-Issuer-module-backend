const { missingJwt } = require('../../../constants/serviceErrors');
const { verifyCredential } = require('../../../services/MouroService');

describe('services/Mouro/verifyCredential.test.js', () => {
  test('Expect verifyCredential to throw on missing jwt', async () => {
    try {
      await verifyCredential(undefined);
    } catch (error) {
      expect(error).toBe(missingJwt);
    }
  });
});
