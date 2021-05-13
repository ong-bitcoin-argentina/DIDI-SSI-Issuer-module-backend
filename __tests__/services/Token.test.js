const {
  generateToken,
  getTokenData,
} = require('../../services/TokenService');
const {
  missingUserId,
  missingToken,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * generateToken
   */
  test('Expect generateToken to throw on missing userId', async () => {
    try {
      await generateToken(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingUserId.code);
    }
  });

  /**
   * getTokenData
   */
  test('Expect getTokenData to throw on missing token', async () => {
    try {
      await getTokenData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });
});
