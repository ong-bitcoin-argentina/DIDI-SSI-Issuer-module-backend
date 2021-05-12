const { create, delete: remove } = require('../../services/DelegateService');
const {
  missingRegisterId, missingDid, missingName,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * create
   */
  test('Expect create to throw on missing did', async () => {
    try {
      await create(undefined, 'name', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect create to throw on missing name', async () => {
    try {
      await create('did', undefined, 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing registerID', async () => {
    try {
      await create('did', 'name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });
  /**
   * delete
   */
  test('Expect delete to throw on missing did', async () => {
    try {
      await remove(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
