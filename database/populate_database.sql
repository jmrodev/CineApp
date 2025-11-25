USE CineApp;

-- Disable foreign key checks to allow truncation of tables with foreign key constraints
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate tables in the correct order (child tables first)
TRUNCATE TABLE Reserva;
TRUNCATE TABLE Funcion;
TRUNCATE TABLE Cliente;
TRUNCATE TABLE Pelicula;
TRUNCATE TABLE Sala;

-- Reset auto-increment counters
ALTER TABLE Pelicula AUTO_INCREMENT = 1;
ALTER TABLE Sala AUTO_INCREMENT = 1;
ALTER TABLE Funcion AUTO_INCREMENT = 1;
ALTER TABLE Cliente AUTO_INCREMENT = 1;
ALTER TABLE Reserva AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Sample data for Pelicula
INSERT INTO Pelicula (titulo, genero, imagen) VALUES
('Inception', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/inception.jpg'),
('The Dark Knight', 'Action', 'https://image.tmdb.org/t/p/w500/darkknight.jpg'),
('Interstellar', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/interstellar.jpg'),
('Pulp Fiction', 'Crime', 'https://image.tmdb.org/t/p/w500/pulpfiction.jpg'),
('Forrest Gump', 'Drama', 'https://image.tmdb.org/t/p/w500/forrestgump.jpg');

-- Sample data for Sala
INSERT INTO Sala (nombre_sala, capacidad) VALUES
('Sala 1', 100),
('Sala 2', 150),
('Sala VIP', 50);

-- Sample data for Cliente
INSERT INTO Cliente (nombre_cliente, email) VALUES
('Juan Perez', 'juan.perez@example.com'),
('Maria Garcia', 'maria.garcia@example.com'),
('Carlos Lopez', 'carlos.lopez@example.com');

-- Sample data for Funcion (assuming pelicula_id and sala_id exist from above inserts)
-- Note: Adjust dates and times as needed
INSERT INTO Funcion (pelicula_id, sala_id, horario) VALUES
(1, 1, '2025-12-01 18:00:00'), -- Inception in Sala 1
(2, 1, '2025-12-01 21:00:00'), -- The Dark Knight in Sala 1
(1, 2, '2025-12-02 19:00:00'), -- Inception in Sala 2
(3, 3, '2025-12-02 20:00:00'); -- Interstellar in Sala VIP

-- Sample data for Reserva (assuming funcion_id and cliente_id exist from above inserts)
INSERT INTO Reserva (funcion_id, cliente_id, numero_asientos) VALUES
(1, 1, 2), -- Juan Perez reserves 2 seats for Inception (Sala 1, 18:00)
(2, 2, 1), -- Maria Garcia reserves 1 seat for The Dark Knight (Sala 1, 21:00)
(3, 1, 3); -- Juan Perez reserves 3 seats for Inception (Sala 2, 19:00)
