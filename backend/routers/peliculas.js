const express = require('express');
const router = express.Router();

// GET all peliculas
router.get('/', (req, res) => {
  res.send('GET all peliculas');
});

// GET one pelicula
router.get('/:id', (req, res) => {
  res.send('GET one pelicula');
});

// CREATE a new pelicula
router.post('/', (req, res) => {
  res.send('CREATE a new pelicula');
});

// UPDATE a pelicula
router.put('/:id', (req, res) => {
  res.send('UPDATE a pelicula');
});

// DELETE a pelicula
router.delete('/:id', (req, res) => {
  res.send('DELETE a pelicula');
});

module.exports = router;
