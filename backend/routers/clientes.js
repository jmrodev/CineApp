const express = require('express');
const router = express.Router();

// GET all clientes
router.get('/', (req, res) => {
  res.send('GET all clientes');
});

// GET one cliente
router.get('/:id', (req, res) => {
  res.send('GET one cliente');
});

// CREATE a new cliente
router.post('/', (req, res) => {
  res.send('CREATE a new cliente');
});

// UPDATE a cliente
router.put('/:id', (req, res) => {
  res.send('UPDATE a cliente');
});

// DELETE a cliente
router.delete('/:id', (req, res) => {
  res.send('DELETE a cliente');
});

module.exports = router;
