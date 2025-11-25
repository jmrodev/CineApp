const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all funciones with optional filters
router.get('/', async (req, res) => {
  try {
    const { pelicula_id, sala_id } = req.query;
    let query = `
      SELECT
          F.funcion_id,
          F.pelicula_id,
          F.sala_id,
          F.horario,
          S.capacidad AS sala_capacidad,
          P.titulo AS pelicula_titulo,
          COALESCE(SUM(R.numero_asientos), 0) AS asientos_reservados
      FROM
          Funcion F
      JOIN
          Sala S ON F.sala_id = S.sala_id
      JOIN
          Pelicula P ON F.pelicula_id = P.pelicula_id
      LEFT JOIN
          Reserva R ON F.funcion_id = R.funcion_id
    `;
    const params = [];

    const conditions = [];
    if (pelicula_id) {
      conditions.push('F.pelicula_id = ?');
      params.push(pelicula_id);
    }
    if (sala_id) {
      conditions.push('F.sala_id = ?');
      params.push(sala_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY
          F.funcion_id, F.pelicula_id, F.sala_id, F.horario, S.capacidad, P.titulo
      ORDER BY
          F.horario ASC;
    `;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las funciones con detalles:', error);
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
    const funcionId = req.params.id;

    // Check for existing reservations for this function
    const [reservas] = await pool.query('SELECT COUNT(*) AS count FROM Reserva WHERE funcion_id = ?', [funcionId]);
    console.log('Reservations count result:', reservas); // Added logging

    if (reservas[0].count > 0) {
      return res.status(409).json({ message: 'Cannot delete function: existing reservations are linked to it.' });
    }

    const [result] = await pool.query('DELETE FROM Funcion WHERE funcion_id = ?', [funcionId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Funcion not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar la función con ID', req.params.id, ':', error); // More detailed logging
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;