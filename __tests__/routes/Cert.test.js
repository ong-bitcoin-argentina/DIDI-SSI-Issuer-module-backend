const request = require('supertest');

const app = require('../../server.js');

const id = 'undefined';

/**
 * getById
 * cambiar el token por uno válido
 * cambia el id por uno válido
 * GET /cert/{id}:
 */
it.only('throw on a missing id', async () => {
  const response = await request(app)
    .get(`/cert/${id}`)
    .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTNhYWU5ODJlNmVkMTAwMmRmYjc2N2UiLCJleHAiOjE2NzEzODM0MTgsImlhdCI6MTY1ODQyMzQxOH0.T2o0iVlFNcScaOSXjm-IWjUjC0raRZfJIIHrFWweCoQ')
    .send('undefinded')
    .expect(200);
  console.log(response.body);
});
