# Diagrama de Flujo de Datos (DFD) para CineApp

Este documento presenta los Diagramas de Flujo de Datos (DFD) para la aplicación CineApp, describiendo cómo los datos se mueven a través del sistema.

## DFD Nivel 0: Diagrama de Contexto

El Diagrama de Contexto muestra el sistema como un único proceso, interactuando con entidades externas.

```mermaid
graph TD
    A[Cliente] -->|Solicita/Recibe Información de Películas| B(Sistema de CineApp)
    A -->|Realiza/Confirma Reservas| B
    B -->|Muestra Películas Disponibles| A
    B -->|Confirma Reserva| A
```

## DFD Nivel 1: Descomposición del Sistema de CineApp

El DFD Nivel 1 descompone el proceso principal "Sistema de CineApp" en sus subprocesos principales y cómo interactúan con los almacenes de datos.

```mermaid
graph TD
    subgraph Sistema de CineApp
        C(Gestión de Películas)
        D(Gestión de Reservas)
    end

    A[Cliente] -->|Ver Películas| C
    C -->|Consulta Películas| E[Base de Datos de Películas]
    E -->|Lista de Películas| C
    C -->|Muestra Películas| A

    A -->|Selecciona Película/Función| D
    A -->|Ingresa Datos de Reserva| D
    D -->|Verifica Disponibilidad| F[Base de Datos de Funciones]
    F -->|Disponibilidad de Asientos| D
    D -->|Guarda Reserva| G[Base de Datos de Reservas]
    G -->|Confirmación de Reserva| D
    D -->|Confirma Reserva| A
```
