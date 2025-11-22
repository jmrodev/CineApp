const request = require('supertest');
const { app, pool } = require('./setup');

describe('Salas API', () => {
  beforeAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Sala');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  afterAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Sala');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  let salaId;

  it('should create a new sala', async () => {
    const newSala = { nombre_sala: 'Sala Test 1', capacidad: 50 };
    const res = await request(app)
      .post('/api/salas')
      .send(newSala);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('sala_id');
    expect(res.body.nombre_sala).toEqual(newSala.nombre_sala);
    expect(res.body.capacidad).toEqual(newSala.capacidad);
    salaId = res.body.sala_id;
  });

  it('should get all salas', async () => {
    const res = await request(app).get('/api/salas');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a sala by ID', async () => {
    const res = await request(app).get(`/api/salas/${salaId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('sala_id', salaId);
  });

  it('should return 404 if sala not found by ID', async () => {
    const res = await request(app).get('/api/salas/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Sala not found');
  });

  it('should update a sala by ID', async () => {
    const updatedSala = { nombre_sala: 'Sala Test Updated', capacidad: 60 };
    const res = await request(app)
      .put(`/api/salas/${salaId}`)
      .send(updatedSala);
    expect(res.statusCode).toEqual(200);
    expect(res.body.nombre_sala).toEqual(updatedSala.nombre_sala);
    expect(res.body.capacidad).toEqual(updatedSala.capacidad);
  });

  it('should return 404 if sala not found for update', async () => {
    const updatedSala = { nombre_sala: 'Non Existent', capacidad: 70 };
    const res = await request(app)
      .put('/api/salas/99999')
      .send(updatedSala);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Sala not found');
  });

  it('should delete a sala by ID', async () => {
    const res = await request(app).delete(`/api/salas/${salaId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if sala not found for delete', async () => {
    const res = await request(app).delete('/api/salas/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Sala not found');
  });
});
