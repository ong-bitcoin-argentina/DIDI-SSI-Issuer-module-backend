const { addDelegate, removeDelegate, validDelegate } = require('../../services/BlockchainService');
const {
  missingRegisterId, missingOtherDID,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * addDelegate
   */
  test('Expect addDelegate to throw on missing registerId', async () => {
    try {
      await addDelegate(undefined, 'otherDID');
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  test('Expect addDelegate to throw on missing otherDID', async () => {
    try {
      await addDelegate('registerId', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOtherDID.code);
    }
  });

  /**
   * removeDelegate
   */
  test('Expect removeDelegate to throw on missing otherDID', async () => {
    try {
      await removeDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOtherDID.code);
    }
  });

  /**
   * validDelegate
   */
  test('Expect validDelegate to throw on missing registerId', async () => {
    try {
      await validDelegate(undefined, 'otherDID');
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  test('Expect validDelegate to throw on missing otherDID', async () => {
    try {
      await validDelegate('registerId', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOtherDID.code);
    }
  });
});
