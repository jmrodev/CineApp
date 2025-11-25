require('dotenv').config({ path: './.env.test' });
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json

// Multer setup for file uploads
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Upload route for images
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Return the URL where the image can be accessed
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Routers
const peliculasRouter = require('./routers/peliculas.js');
const salasRouter = require('./routers/salas.js');
const funcionesRouter = require('./routers/funciones.js');
const clientesRouter = require('./routers/clientes.js');
const reservasRouter = require('./routers/reservas.js');

// Routes
app.use('/api/peliculas', peliculasRouter);
app.use('/api/salas', salasRouter);
app.use('/api/funciones', funcionesRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/reservas', reservasRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).send('Something broke!');
});

if (require.main === module) {
  app.listen(port, () => {
      console.log(`CineApp backend listening on port ${port}`);
  });
}

module.exports = app;
