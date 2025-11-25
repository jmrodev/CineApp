const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all reservas with optional filters
router.get('/', async (req, res) => {
  try {
    const { cliente_id, funcion_id } = req.query;
    let query = 'SELECT * FROM Reserva';
    const params = [];

    if (cliente_id || funcion_id) {
      query += ' WHERE';
      if (cliente_id) {
        query += ' cliente_id = ?';
        params.push(cliente_id);
      }
      if (funcion_id) {
        if (cliente_id) {
          query += ' AND';
        }
        query += ' funcion_id = ?';
        params.push(funcion_id);
      }
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one reserva
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Reserva WHERE reserva_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new reserva
router.post('/', async (req, res) => {
  const { funcion_id, cliente_id, numero_asientos } = req.body;
  if (!funcion_id || !cliente_id || !numero_asientos) {
    return res.status(400).json({ message: 'funcion_id, cliente_id and numero_asientos are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO Reserva (funcion_id, cliente_id, numero_asientos) VALUES (?, ?, ?)', [funcion_id, cliente_id, numero_asientos]);
    res.status(201).json({ reserva_id: result.insertId, funcion_id, cliente_id, numero_asientos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a reserva
router.put('/:id', async (req, res) => {
  const { funcion_id, cliente_id, numero_asientos } = req.body;
  if (!funcion_id || !cliente_id || !numero_asientos) {
    return res.status(400).json({ message: 'funcion_id, cliente_id and numero_asientos are required' });
  }
  try {
    const [result] = await pool.query('UPDATE Reserva SET funcion_id = ?, cliente_id = ?, numero_asientos = ? WHERE reserva_id = ?', [funcion_id, cliente_id, numero_asientos, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.json({ reserva_id: req.params.id, funcion_id, cliente_id, numero_asientos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a reserva
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Reserva WHERE reserva_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;