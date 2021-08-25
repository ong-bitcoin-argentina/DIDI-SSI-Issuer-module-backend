const { editRegister } = require('../../../services/RegisterService');
const { missingDid } = require('../../../constants/serviceErrors');

describe('services/Register/editRegister.test.js', () => {
  test('Expect editRegister to throw on missing did', async () => {
    try {
      await editRegister(undefined, 'body', 'file');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
