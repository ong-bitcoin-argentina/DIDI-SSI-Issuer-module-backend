const request = require('supertest');

const app = require('../../server.js');
const Messages = require('../../constants/Messages.js');
const { createUserTest, deleteUserTest } = require('./utils.js');

const id = 'undefined';
/**
 * getById
 * cambiar el token por uno válido
 * cambia el id por uno válido
 * GET /cert/{id}:
 */
let token;

describe('Test funcional', () => {
  beforeAll(async () => {
    jest.setTimeout(100000);
    token = await createUserTest();
  });
  afterAll(async () => {
    await deleteUserTest();
  });
  it('expect cert/:id to throw missing id', async () => {
    await request(app)
      .get(`/cert/${id}`)
      .set('token', token)
      .send(undefined)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toEqual('error');
        expect(response.body.data).toEqual(Messages.CERT.ERR.GET);
      });
  });
});
