const { newDefault, editDefault } = require('../../services/DefaultService');
const { missingBody } = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * newDefault
   */
  test('Expect newDefault to throw on missing body', async () => {
    try {
      await newDefault(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingBody.code);
    }
  });

  /**
   * editDefault
   */
  test('Expect editDefault to throw on missing body', async () => {
    try {
      await editDefault(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingBody.code);
    }
  });
});
