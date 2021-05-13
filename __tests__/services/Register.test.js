const {
  newRegister,
  getAll,
  editRegister,
  retryRegister,
  refreshRegister,
  revoke,
} = require('../../services/RegisterService');
const {
  missingDid,
  missingName,
  missingToken,
  missingKey,
  missingFilter,
  missingBody,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * newRegister
   */
  test('Expect newRegister to throw on missing did', async () => {
    try {
      await newRegister(undefined, 'key', 'name', 'token');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect newRegister to throw on missing key', async () => {
    try {
      await newRegister('did', undefined, 'name', 'token');
    } catch (e) {
      expect(e.code).toMatch(missingKey.code);
    }
  });

  test('Expect newRegister to throw on missing name', async () => {
    try {
      await newRegister('did', 'key', undefined, 'token');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect newRegister to throw on missing token', async () => {
    try {
      await newRegister('did', 'key', 'name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  /**
   * getAll
   */
  test('Expect getAll to throw on missing filter', async () => {
    try {
      await getAll(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFilter.code);
    }
  });

  /**
   * editRegister
   */
  test('Expect editRegister to throw on missing did', async () => {
    try {
      await editRegister(undefined, 'body');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect editRegister to throw on missing body', async () => {
    try {
      await editRegister('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingBody.code);
    }
  });

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
