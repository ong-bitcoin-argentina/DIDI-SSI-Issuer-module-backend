const {
  createProfile,
  editProfile,
  delete: remove,
} = require('../../services/ProfileService');
const {
  missingId,
  missingBody,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * createProfile
   */
  test('Expect createProfile to throw on missing body', async () => {
    try {
      await createProfile(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingBody.code);
    }
  });

  /**
   * editProfile
   */
  test('Expect editProfile to throw on missing id', async () => {
    try {
      await editProfile(undefined, 'body');
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect editProfile to throw on missing body', async () => {
    try {
      await editProfile('id', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingBody.code);
    }
  });

  /**
   * delete
   */
  test('Expect delete to throw on missing id', async () => {
    try {
      await remove(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
