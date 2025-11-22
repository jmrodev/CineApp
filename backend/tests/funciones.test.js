const request = require('supertest');
const { app, pool } = require('./setup');

describe('Funciones API', () => {
  let peliculaId;
  let salaId;
  let funcionId;

  beforeAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Reserva');
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Pelicula');
    await pool.query('DELETE FROM Sala');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks

    const [peliculaResult] = await pool.query('INSERT INTO Pelicula (titulo, genero) VALUES (?, ?)', ['Pelicula Test', 'Drama']);
    peliculaId = peliculaResult.insertId;

    const [salaResult] = await pool.query('INSERT INTO Sala (nombre_sala, capacidad) VALUES (?, ?)', ['Sala Test', 100]);
    salaId = salaResult.insertId;
  });

  afterAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Reserva');
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Pelicula');
    await pool.query('DELETE FROM Sala');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  it('should create a new funcion', async () => {
    const newFuncion = { pelicula_id: peliculaId, sala_id: salaId, horario: '2025-12-25 18:00:00' };
    const res = await request(app)
      .post('/api/funciones')
      .send(newFuncion);
    if (res.statusCode === 500) {
      console.error('Error creating function:', res.body);
    }
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('funcion_id');
    expect(res.body.pelicula_id).toEqual(newFuncion.pelicula_id);
    expect(res.body.sala_id).toEqual(newFuncion.sala_id);
    expect(res.body.horario).toEqual(newFuncion.horario);
    funcionId = res.body.funcion_id;
  });

  it('should get all funciones', async () => {
    const res = await request(app).get('/api/funciones');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a funcion by ID', async () => {
    const res = await request(app).get(`/api/funciones/${funcionId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('funcion_id', funcionId);
  });

  it('should return 404 if funcion not found by ID', async () => {
    const res = await request(app).get('/api/funciones/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Funcion not found');
  });

  it('should update a funcion by ID', async () => {
    const updatedFuncion = { pelicula_id: peliculaId, sala_id: salaId, horario: '2025-12-26 20:00:00' };
    const res = await request(app)
      .put(`/api/funciones/${funcionId}`)
      .send(updatedFuncion);
    expect(res.statusCode).toEqual(200);
    expect(res.body.horario).toEqual(updatedFuncion.horario);
  });

  it('should return 404 if funcion not found for update', async () => {
    const updatedFuncion = { pelicula_id: peliculaId, sala_id: salaId, horario: '2025-12-27 22:00:00' };
    const res = await request(app)
      .put('/api/funciones/99999')
      .send(updatedFuncion);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Funcion not found');
  });

  it('should delete a funcion by ID', async () => {
    const res = await request(app).delete(`/api/funciones/${funcionId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if funcion not found for delete', async () => {
    const res = await request(app).delete('/api/funciones/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Funcion not found');
  });
});
