const {
  getById,
  findBy,
  create,
  edit,
  addTemplateDataToCert,
  emmit,
  deleteOrRevoke,
} = require('../../services/CertService');
const {
  missingId,
  missingEmmited,
  missingRevoked,
  missingData,
  missingTemplateId,
  missingSplit,
  missingMicroCredentials,
  missingCert,
  missingCreds,
  missingReason,
  missingUserId,
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
   * findBy
   */
  test('Expect findBy to throw on missing emmited', async () => {
    try {
      await findBy({ emmited: undefined, revoked: 'revoked' });
    } catch (e) {
      expect(e.code).toMatch(missingEmmited.code);
    }
  });

  test('Expect findBy to throw on missing revoked', async () => {
    try {
      await findBy({ emmited: 'emmited', revoked: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingRevoked.code);
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

  test('Expect create to throw on missing templateId', async () => {
    try {
      await create('data', undefined, 'split', 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingTemplateId.code);
    }
  });

  test('Expect create to throw on missing split', async () => {
    try {
      await create('data', 'templateId', undefined, 'microCredentials');
    } catch (e) {
      expect(e.code).toMatch(missingSplit.code);
    }
  });

  test('Expect create to throw on missing microCredentials', async () => {
    try {
      await create('data', 'templateId', 'split', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingMicroCredentials.code);
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

  test('Expect edit to throw on missing microCredentials', async () => {
    try {
      await edit('id', 'data', 'split', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingMicroCredentials.code);
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

  test('Expect deleteOrRevoke to throw on missing reason', async () => {
    try {
      await deleteOrRevoke('id', undefined, 'userId');
    } catch (e) {
      expect(e.code).toMatch(missingReason.code);
    }
  });

  test('Expect deleteOrRevoke to throw on missing userId', async () => {
    try {
      await deleteOrRevoke('id', 'reason', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingUserId.code);
    }
  });
});
