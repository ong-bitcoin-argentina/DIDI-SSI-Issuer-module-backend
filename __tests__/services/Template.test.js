const {
  getById,
  create,
  edit,
  delete: remove,
} = require('../../services/TemplateService');
const {
  missingId,
  missingName,
  missingRegisterId,
  missingData,
  missingPreviewData,
  missingPreviewType,
  missingCategory,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * getById
   */
  test('Expect getById to throw on missing id', async () => {
    try {
      await getById(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  /**
   * create
   */
  test('Expect create to throw on missing name', async () => {
    try {
      await create(undefined, 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing registerId', async () => {
    try {
      await create('name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  /**
   * edit
   */
  test('Expect edit to throw on missing id', async () => {
    try {
      await edit(undefined, 'data', 'previewData', 'previewType', 'category', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect edit to throw on missing data', async () => {
    try {
      await edit('id', undefined, 'previewData', 'previewType', 'category', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  test('Expect edit to throw on missing previewData', async () => {
    try {
      await edit('id', 'data', undefined, 'previewType', 'category', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingPreviewData.code);
    }
  });

  test('Expect edit to throw on missing previewType', async () => {
    try {
      await edit('id', 'data', 'previewData', undefined, 'category', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingPreviewType.code);
    }
  });

  test('Expect edit to throw on missing category', async () => {
    try {
      await edit('id', 'data', 'previewData', 'previewType', undefined, 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingCategory.code);
    }
  });

  test('Expect edit to throw on missing registerId', async () => {
    try {
      await edit('id', 'data', 'previewData', 'previewType', 'category', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  /**
   * remove
   */
  test('Expect edit to throw on missing id', async () => {
    try {
      await remove(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
