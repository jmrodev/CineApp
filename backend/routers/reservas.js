const express = require('express');
const router = express.Router();

// GET all reservas
router.get('/', (req, res) => {
  res.send('GET all reservas');
});

// GET one reserva
router.get('/:id', (req, res) => {
  res.send('GET one reserva');
});

// CREATE a new reserva
router.post('/', (req, res) => {
  res.send('CREATE a new reserva');
});

// UPDATE a reserva
router.put('/:id', (req, res) => {
  res.send('UPDATE a reserva');
});

// DELETE a reserva
router.delete('/:id', (req, res) => {
  res.send('DELETE a reserva');
});

module.exports = router;
