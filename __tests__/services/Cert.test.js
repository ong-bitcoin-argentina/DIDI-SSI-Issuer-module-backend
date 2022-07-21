const {
  getById,
  create,
  edit,
  addTemplateDataToCert,
  emmit,
  deleteOrRevoke,
} = require('../../services/CertService');
const {
  missingId,
  missingData,
  missingSplit,
  missingCert,
  missingCreds,
  missingTemplate,
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
  test('Expect create to throw on missing data', async () => {
    try {
      await create(undefined, 'templateId', 'split', 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  test('Expect create to throw on missing split', async () => {
    try {
      await create('data', 'templateId', undefined, 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingSplit.code);
    }
  });

  /**
   * edit
   */
  test('Expect edit to throw on missing id', async () => {
    try {
      await edit(undefined, 'data', 'split', 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect edit to throw on missing data', async () => {
    try {
      await edit('id', undefined, 'split', 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  test('Expect edit to throw on missing split', async () => {
    try {
      await edit('id', 'data', undefined, 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingSplit.code);
    }
  });

  /**
   * addTemplateDataToCert
   */
  test('Expect addTemplateDataToCert to throw on missing cert', async () => {
    try {
      await addTemplateDataToCert(undefined, 'template');
    } catch (e) {
      expect(e.code).toMatch(missingCert.code);
    }
  });

  test('Expect addTemplateDataToCert to throw on missing template', async () => {
    try {
      await addTemplateDataToCert('cert', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingTemplate.code);
    }
  });

  /**
   * emmit
   */
  test('Expect emmit to throw on missing cert', async () => {
    try {
      await emmit(undefined, 'creds');
    } catch (e) {
      expect(e.code).toMatch(missingCert.code);
    }
  });

  test('Expect emmit to throw on missing creds', async () => {
    try {
      await emmit('cert', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCreds.code);
    }
  });

  /**
   * deleteOrRevoke
   */
  test('Expect deleteOrRevoke to throw on missing id', async () => {
    try {
      await deleteOrRevoke(undefined, 'reason', 'userId');
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
