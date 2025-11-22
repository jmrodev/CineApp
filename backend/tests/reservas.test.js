const request = require('supertest');
const { app, pool } = require('./setup');

describe('Reservas API', () => {
  let peliculaId;
  let salaId;
  let funcionId;
  let clienteId;
  let reservaId;

  beforeAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Reserva');
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Pelicula');
    await pool.query('DELETE FROM Sala');
    await pool.query('DELETE FROM Cliente');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks

    const [peliculaResult] = await pool.query('INSERT INTO Pelicula (titulo, genero) VALUES (?, ?)', ['Pelicula Reserva', 'Comedia']);
    peliculaId = peliculaResult.insertId;

    const [salaResult] = await pool.query('INSERT INTO Sala (nombre_sala, capacidad) VALUES (?, ?)', ['Sala Reserva', 80]);
    salaId = salaResult.insertId;

    const [funcionResult] = await pool.query('INSERT INTO Funcion (pelicula_id, sala_id, horario) VALUES (?, ?, ?)', [peliculaId, salaId, '2025-12-30 19:00:00']);
    funcionId = funcionResult.insertId;

    const [clienteResult] = await pool.query('INSERT INTO Cliente (nombre_cliente, email) VALUES (?, ?)', ['Cliente Reserva', 'cliente.reserva@example.com']);
    clienteId = clienteResult.insertId;
  });

  afterAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Reserva');
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Pelicula');
    await pool.query('DELETE FROM Sala');
    await pool.query('DELETE FROM Cliente');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  it('should create a new reserva', async () => {
    const newReserva = { funcion_id: funcionId, cliente_id: clienteId, numero_asientos: 2 };
    const res = await request(app)
      .post('/api/reservas')
      .send(newReserva);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('reserva_id');
    expect(res.body.funcion_id).toEqual(newReserva.funcion_id);
    expect(res.body.cliente_id).toEqual(newReserva.cliente_id);
    expect(res.body.numero_asientos).toEqual(newReserva.numero_asientos);
    reservaId = res.body.reserva_id;
  });

  it('should get all reservas', async () => {
    const res = await request(app).get('/api/reservas');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a reserva by ID', async () => {
    const res = await request(app).get(`/api/reservas/${reservaId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reserva_id', reservaId);
  });

  it('should return 404 if reserva not found by ID', async () => {
    const res = await request(app).get('/api/reservas/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Reserva not found');
  });

  it('should update a reserva by ID', async () => {
    const updatedReserva = { funcion_id: funcionId, cliente_id: clienteId, numero_asientos: 3 };
    const res = await request(app)
      .put(`/api/reservas/${reservaId}`)
      .send(updatedReserva);
    expect(res.statusCode).toEqual(200);
    expect(res.body.numero_asientos).toEqual(updatedReserva.numero_asientos);
  });

  it('should return 404 if reserva not found for update', async () => {
    const updatedReserva = { funcion_id: funcionId, cliente_id: clienteId, numero_asientos: 1 };
    const res = await request(app)
      .put('/api/reservas/99999')
      .send(updatedReserva);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Reserva not found');
  });

  it('should delete a reserva by ID', async () => {
    const res = await request(app).delete(`/api/reservas/${reservaId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if reserva not found for delete', async () => {
    const res = await request(app).delete('/api/reservas/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Reserva not found');
  });
});
