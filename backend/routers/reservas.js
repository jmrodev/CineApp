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
  if (!funcion_id || !cliente_id || !numero_asientos || numero_asientos <= 0) {
    return res.status(400).json({ message: 'funcion_id, cliente_id and numero_asientos are required and numero_asientos must be positive' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Obtener detalles de la función para saber la sala
    const [funciones] = await connection.query('SELECT sala_id FROM Funcion WHERE funcion_id = ?', [funcion_id]);
    if (funciones.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Funcion not found' });
    }
    const sala_id = funciones[0].sala_id;

    // 2. Obtener la capacidad actual de la sala
    const [salas] = await connection.query('SELECT capacidad FROM Sala WHERE sala_id = ? FOR UPDATE', [sala_id]); // FOR UPDATE para bloqueo de fila
    if (salas.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sala not found' });
    }
    const capacidadActual = salas[0].capacidad;

    // 3. Verificar disponibilidad de asientos
    if (capacidadActual < numero_asientos) {
      await connection.rollback();
      return res.status(400).json({ message: `No hay suficientes asientos disponibles en la sala. Capacidad actual: ${capacidadActual}` });
    }

    // 4. Actualizar capacidad de la sala
    const nuevaCapacidad = capacidadActual - numero_asientos;
    await connection.query('UPDATE Sala SET capacidad = ? WHERE sala_id = ?', [nuevaCapacidad, sala_id]);

    // 5. Crear la reserva
    const [result] = await connection.query('INSERT INTO Reserva (funcion_id, cliente_id, numero_asientos) VALUES (?, ?, ?)', [funcion_id, cliente_id, numero_asientos]);

    await connection.commit();
    res.status(201).json({ reserva_id: result.insertId, funcion_id, cliente_id, numero_asientos });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error al crear la reserva y actualizar la capacidad de la sala:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// UPDATE a reserva
router.put('/:id', async (req, res) => {
  const reserva_id = req.params.id;
  const { funcion_id, cliente_id, numero_asientos } = req.body;

  if (!funcion_id || !cliente_id || !numero_asientos || numero_asientos <= 0) {
    return res.status(400).json({ message: 'funcion_id, cliente_id and numero_asientos are required and numero_asientos must be positive' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Obtener la reserva original
    const [originalReservas] = await connection.query('SELECT funcion_id, numero_asientos FROM Reserva WHERE reserva_id = ? FOR UPDATE', [reserva_id]);
    if (originalReservas.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Reserva not found' });
    }
    const originalReserva = originalReservas[0];

    // 2. Obtener la sala original asociada a la función original
    const [originalFunciones] = await connection.query('SELECT sala_id FROM Funcion WHERE funcion_id = ?', [originalReserva.funcion_id]);
    if (originalFunciones.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Original Function associated with reservation not found' });
    }
    const originalSalaId = originalFunciones[0].sala_id;

    // 3. Obtener la sala nueva asociada a la nueva función (si la función ha cambiado)
    let newSalaId = originalSalaId;
    if (originalReserva.funcion_id !== funcion_id) {
      const [newFunciones] = await connection.query('SELECT sala_id FROM Funcion WHERE funcion_id = ?', [funcion_id]);
      if (newFunciones.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'New Function not found' });
      }
      newSalaId = newFunciones[0].sala_id;
    }

    // 4. Ajustar capacidad de la sala original (devolver asientos)
    await connection.query('UPDATE Sala SET capacidad = capacidad + ? WHERE sala_id = ?', [originalReserva.numero_asientos, originalSalaId]);

    // 5. Obtener la capacidad actual de la nueva sala (o la misma si no cambió)
    const [salas] = await connection.query('SELECT capacidad FROM Sala WHERE sala_id = ? FOR UPDATE', [newSalaId]);
    if (salas.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sala not found for capacity check' });
    }
    const capacidadActualNuevaSala = salas[0].capacidad;

    // 6. Verificar disponibilidad de asientos en la nueva sala
    if (capacidadActualNuevaSala < numero_asientos) {
      await connection.rollback();
      // Revertir la capacidad de la sala original si la nueva reserva falla
      await connection.query('UPDATE Sala SET capacidad = capacidad - ? WHERE sala_id = ?', [originalReserva.numero_asientos, originalSalaId]);
      return res.status(400).json({ message: `No hay suficientes asientos disponibles en la sala. Capacidad actual: ${capacidadActualNuevaSala}` });
    }

    // 7. Actualizar capacidad de la nueva sala (restar asientos)
    await connection.query('UPDATE Sala SET capacidad = capacidad - ? WHERE sala_id = ?', [numero_asientos, newSalaId]);

    // 8. Actualizar la reserva
    const [result] = await connection.query('UPDATE Reserva SET funcion_id = ?, cliente_id = ?, numero_asientos = ? WHERE reserva_id = ?', [funcion_id, cliente_id, numero_asientos, reserva_id]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Reserva not found after capacity update attempt' });
    }

    await connection.commit();
    res.json({ reserva_id, funcion_id, cliente_id, numero_asientos });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error al actualizar la reserva y ajustar la capacidad de la sala:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// DELETE a reserva
router.delete('/:id', async (req, res) => {
  const reserva_id = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Obtener detalles de la reserva a eliminar
    const [reservas] = await connection.query('SELECT funcion_id, numero_asientos FROM Reserva WHERE reserva_id = ?', [reserva_id]);
    if (reservas.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Reserva not found' });
    }
    const { funcion_id, numero_asientos } = reservas[0];

    // 2. Obtener la sala asociada a la función de la reserva
    const [funciones] = await connection.query('SELECT sala_id FROM Funcion WHERE funcion_id = ?', [funcion_id]);
    if (funciones.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Funcion associated with reservation not found' });
    }
    const sala_id = funciones[0].sala_id;

    // 3. Devolver los asientos a la capacidad de la sala
    await connection.query('UPDATE Sala SET capacidad = capacidad + ? WHERE sala_id = ?', [numero_asientos, sala_id]);

    // 4. Eliminar la reserva
    const [result] = await connection.query('DELETE FROM Reserva WHERE reserva_id = ?', [reserva_id]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Reserva not found after capacity update attempt' });
    }

    await connection.commit();
    res.status(204).send();

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error al eliminar la reserva y devolver la capacidad de la sala:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;