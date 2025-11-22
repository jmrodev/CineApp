const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all funciones
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Funcion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one funcion
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Funcion WHERE funcion_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Funcion not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new funcion
router.post('/', async (req, res) => {
  const { pelicula_id, sala_id, horario } = req.body;
  if (!pelicula_id || !sala_id || !horario) {
    return res.status(400).json({ message: 'pelicula_id, sala_id and horario are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO Funcion (pelicula_id, sala_id, horario) VALUES (?, ?, ?)', [pelicula_id, sala_id, horario]);
    res.status(201).json({ funcion_id: result.insertId, pelicula_id, sala_id, horario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a funcion
router.put('/:id', async (req, res) => {
  const { pelicula_id, sala_id, horario } = req.body;
  if (!pelicula_id || !sala_id || !horario) {
    return res.status(400).json({ message: 'pelicula_id, sala_id and horario are required' });
  }
  try {
    const [result] = await pool.query('UPDATE Funcion SET pelicula_id = ?, sala_id = ?, horario = ? WHERE funcion_id = ?', [pelicula_id, sala_id, horario, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Funcion not found' });
    }
    res.json({ funcion_id: req.params.id, pelicula_id, sala_id, horario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a funcion
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Funcion WHERE funcion_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Funcion not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;