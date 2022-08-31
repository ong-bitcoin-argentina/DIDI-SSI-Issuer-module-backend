jest.mock('node-fetch');
const fetch = require('node-fetch');

const { Response } = jest.requireActual('node-fetch');
const { getAll } = require('../../services/TranslateService');

describe('services/TranslateService.test.js', () => {
  test('Expect getAll to success', async () => {
    const downloadDocumentData = { data: {} };
    const getDocList = new Response(JSON.stringify(downloadDocumentData));
    fetch.mockResolvedValueOnce(Promise.resolve(getDocList));
    const res = await getAll();
    expect(res).toEqual({});
  });
});
