const express = require('express');
const router = express.Router();

// GET all salas
router.get('/', (req, res) => {
  res.send('GET all salas');
});

// GET one sala
router.get('/:id', (req, res) => {
  res.send('GET one sala');
});

// CREATE a new sala
router.post('/', (req, res) => {
  res.send('CREATE a new sala');
});

// UPDATE a sala
router.put('/:id', (req, res) => {
  res.send('UPDATE a sala');
});

// DELETE a sala
router.delete('/:id', (req, res) => {
  res.send('DELETE a sala');
});

module.exports = router;
