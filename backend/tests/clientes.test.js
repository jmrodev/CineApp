const request = require('supertest');
const { app, pool } = require('./setup');

describe('Clientes API', () => {
  beforeAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Reserva'); // Cliente is parent of Reserva
    await pool.query('DELETE FROM Cliente');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  afterAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Reserva'); // Cliente is parent of Reserva
    await pool.query('DELETE FROM Cliente');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  let clienteId;

  it('should create a new cliente', async () => {
    const newCliente = { nombre_cliente: 'Test Cliente', email: 'test@example.com' };
    const res = await request(app)
      .post('/api/clientes')
      .send(newCliente);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('cliente_id');
    expect(res.body.nombre_cliente).toEqual(newCliente.nombre_cliente);
    expect(res.body.email).toEqual(newCliente.email);
    clienteId = res.body.cliente_id;
  });

  it('should get all clientes', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a cliente by ID', async () => {
    const res = await request(app).get(`/api/clientes/${clienteId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('cliente_id', clienteId);
  });

  it('should return 404 if cliente not found by ID', async () => {
    const res = await request(app).get('/api/clientes/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Cliente not found');
  });

  it('should update a cliente by ID', async () => {
    const updatedCliente = { nombre_cliente: 'Updated Cliente', email: 'updated@example.com' };
    const res = await request(app)
      .put(`/api/clientes/${clienteId}`)
      .send(updatedCliente);
    expect(res.statusCode).toEqual(200);
    expect(res.body.nombre_cliente).toEqual(updatedCliente.nombre_cliente);
    expect(res.body.email).toEqual(updatedCliente.email);
  });

  it('should return 404 if cliente not found for update', async () => {
    const updatedCliente = { nombre_cliente: 'Non Existent', email: 'nonexistent@example.com' };
    const res = await request(app)
      .put('/api/clientes/99999')
      .send(updatedCliente);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Cliente not found');
  });

  it('should delete a cliente by ID', async () => {
    const res = await request(app).delete(`/api/clientes/${clienteId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if cliente not found for delete', async () => {
    const res = await request(app).delete('/api/clientes/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Cliente not found');
  });
});
