const { getAll } = require('../../../services/RegisterService');
const { missingFilter } = require('../../../constants/serviceErrors');

describe('services/Register/getAll.test.js', () => {
  test('Expect getAll to throw on missing filter', async () => {
    try {
      await getAll(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFilter.code);
    }
  });
});
