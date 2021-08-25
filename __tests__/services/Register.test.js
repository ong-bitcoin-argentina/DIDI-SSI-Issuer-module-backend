const {
  retryRegister,
  refreshRegister,
  revoke,
} = require('../../services/RegisterService');
const {
  missingDid,
  missingToken,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * retryRegister
   */
  test('Expect retryRegister to throw on missing did', async () => {
    try {
      await retryRegister(undefined, 'token');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect retryRegister to throw on missing token', async () => {
    try {
      await retryRegister('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  /**
   * refreshRegister
   */
  test('Expect refreshRegister to throw on missing did', async () => {
    try {
      await refreshRegister(undefined, 'token');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect refreshRegister to throw on missing token', async () => {
    try {
      await refreshRegister('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  /**
   * revoke
   */
  test('Expect revoke to throw on missing did', async () => {
    try {
      await revoke(undefined, 'token');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect revoke to throw on missing token', async () => {
    try {
      await revoke('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });
});
