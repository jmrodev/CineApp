const request = require('supertest');
const { app, pool } = require('./setup');

describe('Peliculas API', () => {
  beforeAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Pelicula');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  afterAll(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await pool.query('DELETE FROM Funcion');
    await pool.query('DELETE FROM Pelicula');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  let peliculaId;

  it('should create a new pelicula', async () => {
    const newPelicula = { titulo: 'Test Pelicula', genero: 'Accion' };
    const res = await request(app)
      .post('/api/peliculas')
      .send(newPelicula);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('pelicula_id');
    expect(res.body.titulo).toEqual(newPelicula.titulo);
    expect(res.body.genero).toEqual(newPelicula.genero);
    peliculaId = res.body.pelicula_id;
  });

  it('should get all peliculas', async () => {
    const res = await request(app).get('/api/peliculas');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a pelicula by ID', async () => {
    const res = await request(app).get(`/api/peliculas/${peliculaId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('pelicula_id', peliculaId);
  });

  it('should return 404 if pelicula not found by ID', async () => {
    const res = await request(app).get('/api/peliculas/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Pelicula not found');
  });

  it('should update a pelicula by ID', async () => {
    const updatedPelicula = { titulo: 'Updated Pelicula', genero: 'Drama' };
    const res = await request(app)
      .put(`/api/peliculas/${peliculaId}`)
      .send(updatedPelicula);
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toEqual(updatedPelicula.titulo);
    expect(res.body.genero).toEqual(updatedPelicula.genero);
  });

  it('should return 404 if pelicula not found for update', async () => {
    const updatedPelicula = { titulo: 'Non Existent', genero: 'Comedy' };
    const res = await request(app)
      .put('/api/peliculas/99999')
      .send(updatedPelicula);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Pelicula not found');
  });

  it('should delete a pelicula by ID', async () => {
    const res = await request(app).delete(`/api/peliculas/${peliculaId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if pelicula not found for delete', async () => {
    const res = await request(app).delete('/api/peliculas/99999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Pelicula not found');
  });
});
