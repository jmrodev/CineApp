const express = require('express');
const router = express.Router();

// GET all funciones
router.get('/', (req, res) => {
  res.send('GET all funciones');
});

// GET one funcion
router.get('/:id', (req, res) => {
  res.send('GET one funcion');
});

// CREATE a new funcion
router.post('/', (req, res) => {
  res.send('CREATE a new funcion');
});

// UPDATE a funcion
router.put('/:id', (req, res) => {
  res.send('UPDATE a funcion');
});

// DELETE a funcion
router.delete('/:id', (req, res) => {
  res.send('DELETE a funcion');
});

module.exports = router;
