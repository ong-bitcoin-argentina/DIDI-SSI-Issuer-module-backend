const {
  getByDid,
  getById,
  getAllByTemplateId,
  getByRequestCode,
  create,
  edit,
  delete: remove,
} = require('../../services/ParticipantService');
const {
  missingDid,
  missingId,
  missingTemplateId,
  missingRequestCode,
  missingName,
  missingData,
  missingCode,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * getByDid
   */
  test('Expect getByDid to throw on missing did', async () => {
    try {
      await getByDid(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

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
   * getAllByTemplateId
   */
  test('Expect getAllByTemplateId to throw on missing templateId', async () => {
    try {
      await getAllByTemplateId(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingTemplateId.code);
    }
  });

  /**
   * getByRequestCode
   */
  test('Expect getByRequestCode to throw on missing requestCode', async () => {
    try {
      await getByRequestCode(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRequestCode.code);
    }
  });

  /**
   * create
   */
  test('Expect create to throw on missing name', async () => {
    try {
      await create(undefined, 'did', 'data', 'templateId', 'code');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing did', async () => {
    try {
      await create('name', undefined, 'data', 'templateId', 'code');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect create to throw on missing data', async () => {
    try {
      await create('name', 'did', undefined, 'templateId', 'code');
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  test('Expect create to throw on missing code', async () => {
    try {
      await create('name', 'did', 'data', 'templateId', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  /**
   * edit
   */
  test('Expect edit to throw on missing id', async () => {
    try {
      await edit(undefined, 'name', 'data');
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect edit to throw on missing name', async () => {
    try {
      await edit('id', undefined, 'data');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect edit to throw on missing data', async () => {
    try {
      await edit('id', 'name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
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
