const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all peliculas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Pelicula');
    res.json(rows);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// GET one pelicula
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Pelicula WHERE pelicula_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pelicula not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new pelicula
router.post('/', async (req, res) => {
  const { titulo, genero } = req.body;
  if (!titulo) {
    return res.status(400).json({ message: 'titulo is required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO Pelicula (titulo, genero) VALUES (?, ?)', [titulo, genero]);
    res.status(201).json({ pelicula_id: result.insertId, titulo, genero });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a pelicula
router.put('/:id', async (req, res) => {
  const { titulo, genero } = req.body;
  if (!titulo) {
    return res.status(400).json({ message: 'titulo is required' });
  }
  try {
    const [result] = await pool.query('UPDATE Pelicula SET titulo = ?, genero = ? WHERE pelicula_id = ?', [titulo, genero, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pelicula not found' });
    }
    res.json({ pelicula_id: req.params.id, titulo, genero });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// DELETE a pelicula
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Pelicula WHERE pelicula_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pelicula not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;