# Diagrama de Flujo de Trabajo (Workflow) para CineApp

Este documento presenta un diagrama de flujo de trabajo que describe el proceso típico de un cliente al reservar entradas en la aplicación CineApp.

## Flujo de Reserva de Entradas

```mermaid
graph TD
    A[Inicio: Cliente abre la aplicación] --> B{Ver Películas Disponibles?}
    B -- Sí --> C[Mostrar Lista de Películas]
    C --> D[Cliente selecciona una Película]
    D --> E{Ver Funciones Disponibles?}
    E -- Sí --> F[Mostrar Horarios y Salas]
    F --> G[Cliente selecciona una Función]
    G --> H[Cliente ingresa Cantidad de Asientos]
    H --> I{Verificar Disponibilidad de Asientos?}
    I -- Sí, hay asientos --> J[Cliente Confirma Reserva]
    I -- No, no hay asientos --> K[Informar: Asientos no disponibles]
    K --> F
    J --> L[Procesar Pago - Placeholder]
    L --> M[Generar Confirmación de Reserva]
    M --> N[Fin: Cliente recibe Confirmación]
    
    classDef startEnd fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    classDef process fill:#bbdefb,stroke:#1565c0,stroke-width:2px
    classDef decision fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    
    class A,N startEnd
    class C,D,F,G,H,J,K,L,M process
    class B,E,I decision
```
