const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json

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

if (require.main === module) {
  app.listen(port, () => {
      console.log(`CineApp backend listening on port ${port}`);
  });
}

module.exports = app;
