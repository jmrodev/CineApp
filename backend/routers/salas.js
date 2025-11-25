const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all salas
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
          S.sala_id,
          S.nombre_sala,
          S.capacidad,
          F.funcion_id,
          F.pelicula_id,
          F.horario,
          P.titulo AS pelicula_titulo
      FROM
          Sala S
      LEFT JOIN
          Funcion F ON S.sala_id = F.sala_id
      LEFT JOIN
          Pelicula P ON F.pelicula_id = P.pelicula_id
      WHERE
          F.horario > NOW() OR F.funcion_id IS NULL
      ORDER BY
          S.sala_id, F.horario;
    `;
    const [rows] = await pool.query(query);

    const salasMap = new Map();

    rows.forEach(row => {
      if (!salasMap.has(row.sala_id)) {
        salasMap.set(row.sala_id, {
          sala_id: row.sala_id,
          nombre_sala: row.nombre_sala,
          capacidad: row.capacidad,
          funciones: []
        });
      }
      if (row.funcion_id) {
        salasMap.get(row.sala_id).funciones.push({
          funcion_id: row.funcion_id,
          pelicula_id: row.pelicula_id,
          pelicula_titulo: row.pelicula_titulo,
          horario: row.horario
        });
      }
    });

    res.json(Array.from(salasMap.values()));
  } catch (error) {
    console.error('Error al obtener las salas con funciones:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET one sala
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sala WHERE sala_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sala not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new sala
router.post('/', async (req, res) => {
  const { nombre_sala, capacidad } = req.body;
  if (!nombre_sala || !capacidad) {
    return res.status(400).json({ message: 'nombre_sala and capacidad are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO Sala (nombre_sala, capacidad) VALUES (?, ?)', [nombre_sala, capacidad]);
    res.status(201).json({ sala_id: result.insertId, nombre_sala, capacidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a sala
router.put('/:id', async (req, res) => {
  const { nombre_sala, capacidad } = req.body;
  if (!nombre_sala || !capacidad) {
    return res.status(400).json({ message: 'nombre_sala and capacidad are required' });
  }
  try {
    const [result] = await pool.query('UPDATE Sala SET nombre_sala = ?, capacidad = ? WHERE sala_id = ?', [nombre_sala, capacidad, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sala not found' });
    }
    res.json({ sala_id: req.params.id, nombre_sala, capacidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a sala
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Sala WHERE sala_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sala not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;