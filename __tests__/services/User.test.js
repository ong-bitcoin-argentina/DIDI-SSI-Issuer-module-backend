const {
  login,
  getById,
  create,
  createAdmin,
  delete: remove,
  edit,
} = require('../../services/UserService');

const {
  missingName,
  missingPassword,
  missingUserId,
  missingProfileId,
  missingId,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * login
   */
  test('Expect login to throw on missing name', async () => {
    try {
      await login(undefined, 'password');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect login to throw on missing password', async () => {
    try {
      await login('name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  /**
   * getById
   */
  test('Expect getById to throw on missing userId', async () => {
    try {
      await getById(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingUserId.code);
    }
  });

  /**
   * create
   */
  test('Expect create to throw on missing name', async () => {
    try {
      await create(undefined, 'password', 'profileId');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing password', async () => {
    try {
      await create('name', undefined, 'profileId');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect create to throw on missing profileId', async () => {
    try {
      await create('name', 'password', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingProfileId.code);
    }
  });

  /**
   * createAdmin
   */
  test('Expect createAdmin to throw on missing name', async () => {
    try {
      await createAdmin(undefined, 'password');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect createAdmin to throw on missing password', async () => {
    try {
      await createAdmin('name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  /**
   * remove
   */
  test('Expect remove to throw on missing id', async () => {
    try {
      await remove(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  /**
   * edit
   */
  test('Expect edit to throw on missing id', async () => {
    try {
      await edit(undefined, 'name', 'password', 'profileId');
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect edit to throw on missing name', async () => {
    try {
      await edit('id', undefined, 'password', 'profileId');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect edit to throw on missing password', async () => {
    try {
      await edit('id', 'name', undefined, 'profileId');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect edit to throw on missing profileId', async () => {
    try {
      await edit('id', 'name', 'password', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingProfileId.code);
    }
  });
});
