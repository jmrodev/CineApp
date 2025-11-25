-- SQL script for creating the database and tables for CineApp

-- Create database if it does not exist
CREATE DATABASE IF NOT EXISTS CineApp;
USE CineApp;

-- Create Pelicula table
CREATE TABLE IF NOT EXISTS Pelicula (
    pelicula_id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    genero VARCHAR(255),
    imagen VARCHAR(255) NULL
);

-- Create Sala table
CREATE TABLE IF NOT EXISTS Sala (
    sala_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_sala VARCHAR(255) NOT NULL,
    capacidad INT NOT NULL
);

-- Create Funcion table
CREATE TABLE IF NOT EXISTS Funcion (
    funcion_id INT PRIMARY KEY AUTO_INCREMENT,
    pelicula_id INT,
    sala_id INT,
    horario DATETIME,
    FOREIGN KEY (pelicula_id) REFERENCES Pelicula(pelicula_id),
    FOREIGN KEY (sala_id) REFERENCES Sala(sala_id)
);

-- Create Cliente table
CREATE TABLE IF NOT EXISTS Cliente (
    cliente_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create Reserva table
CREATE TABLE IF NOT EXISTS Reserva (
    reserva_id INT PRIMARY KEY AUTO_INCREMENT,
    funcion_id INT,
    cliente_id INT,
    numero_asientos INT NOT NULL,
    FOREIGN KEY (funcion_id) REFERENCES Funcion(funcion_id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id)
);