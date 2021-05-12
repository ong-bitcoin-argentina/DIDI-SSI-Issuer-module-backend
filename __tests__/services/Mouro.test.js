const {
  decodeCertificate, createShareRequest, createCertificate, saveCertificate, revokeCertificate,
  sendShareRequest, getSkeletonForEmmit,
} = require('../../services/MouroService');

const {
  missingJwt, missingErrMsg, missingClaims, missingCb, missingRegisterId, missingSubject,
  missingExpDate, missingDid, missingTemplate, missingCert, missingSendPush, missingHash,
  missingSub, missingWrapped,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
  * decodeCertificate
  */
  test('Expect decodeCertificate to throw on missing jwt', async () => {
    try {
      await decodeCertificate(undefined, 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect decodeCertificate to throw on missing errMsg', async () => {
    try {
      await decodeCertificate('jwt', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });

  /*
  *createShareRequest
  */
  test('Expect createShareRequest to throw on missing claims', async () => {
    try {
      await createShareRequest(undefined, 'cb', 'registerID');
    } catch (e) {
      expect(e.code).toMatch(missingClaims.code);
    }
  });

  test('Expect createShareRequest to throw on missing cb', async () => {
    try {
      await createShareRequest('claims', undefined, 'registerID');
    } catch (e) {
      expect(e.code).toMatch(missingCb.code);
    }
  });

  test('Expect createShareRequest to throw on registerId cb', async () => {
    try {
      await createShareRequest('claims', 'cb', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  /**
   * createCertificate
   */
  test('Expect createCertificate to throw on missing subject', async () => {
    try {
      await createCertificate(undefined, 'expDate', 'did', 'template');
    } catch (e) {
      expect(e.code).toMatch(missingSubject.code);
    }
  });

  test('Expect createCertificate to throw on missing expDate', async () => {
    try {
      await createCertificate('subject', undefined, 'did', 'template');
    } catch (e) {
      expect(e.code).toMatch(missingExpDate.code);
    }
  });

  test('Expect createCertificate to throw on missing did', async () => {
    try {
      await createCertificate('subject', 'expDate', undefined, 'template');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createCertificate to throw on missing template', async () => {
    try {
      await createCertificate('subject', 'expDate', 'did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingTemplate.code);
    }
  });

  /**
   * saveCertificate
   */
  test('Expect saveCertificate to throw on missing cert', async () => {
    try {
      await saveCertificate(undefined, 'sendPush', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingCert.code);
    }
  });

  test('Expect saveCertificate to throw on missing sendPush', async () => {
    try {
      await saveCertificate('cert', undefined, 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingSendPush.code);
    }
  });

  test('Expect saveCertificate to throw on missing registerId', async () => {
    try {
      await saveCertificate('cert', 'sendPush', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  /**
   * revokeCertificate
   */
  test('Expect revokeCertificate to throw on missing jwt', async () => {
    try {
      await revokeCertificate(undefined, 'hash', 'sub', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect revokeCertificate to throw on missing hash', async () => {
    try {
      await revokeCertificate('jwt', undefined, 'sub', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingHash.code);
    }
  });

  test('Expect revokeCertificate to throw on missing sub', async () => {
    try {
      await revokeCertificate('jwt', 'hash', undefined, 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingSub.code);
    }
  });

  test('Expect revokeCertificate to throw on missing registerId', async () => {
    try {
      await revokeCertificate('jwt', 'hash', 'sub', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  /**
   * sendShareRequest
   */
  test('Expect sendShareRequest to throw on missing did', async () => {
    try {
      await sendShareRequest(undefined, 'cert', 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect sendShareRequest to throw on missing cert', async () => {
    try {
      await sendShareRequest('did', undefined, 'registerId');
    } catch (e) {
      expect(e.code).toMatch(missingCert.code);
    }
  });

  test('Expect sendShareRequest to throw on missing registerId', async () => {
    try {
      await sendShareRequest('did', 'cert', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingRegisterId.code);
    }
  });

  /**
   * getSkeletonForEmmit
   */
  test('Expect getSkeletonForEmmit to throw on missing template', async () => {
    try {
      await getSkeletonForEmmit(undefined, 'wrapped');
    } catch (e) {
      expect(e.code).toMatch(missingTemplate.code);
    }
  });

  test('Expect getSkeletonForEmmit to throw on missing wrapped', async () => {
    try {
      await getSkeletonForEmmit('template', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingWrapped.code);
    }
  });
});
