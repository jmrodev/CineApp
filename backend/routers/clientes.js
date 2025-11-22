const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all clientes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Cliente');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one cliente
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Cliente WHERE cliente_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new cliente
router.post('/', async (req, res) => {
  const { nombre_cliente, email } = req.body;
  if (!nombre_cliente || !email) {
    return res.status(400).json({ message: 'nombre_cliente and email are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO Cliente (nombre_cliente, email) VALUES (?, ?)', [nombre_cliente, email]);
    res.status(201).json({ cliente_id: result.insertId, nombre_cliente, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a cliente
router.put('/:id', async (req, res) => {
  const { nombre_cliente, email } = req.body;
  if (!nombre_cliente || !email) {
    return res.status(400).json({ message: 'nombre_cliente and email are required' });
  }
  try {
    const [result] = await pool.query('UPDATE Cliente SET nombre_cliente = ?, email = ? WHERE cliente_id = ?', [nombre_cliente, email, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente not found' });
    }
    res.json({ cliente_id: req.params.id, nombre_cliente, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a cliente
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Cliente WHERE cliente_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;