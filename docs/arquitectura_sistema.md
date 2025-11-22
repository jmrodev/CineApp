# Diagrama de Arquitectura del Sistema

Este diagrama muestra la arquitectura general de CineApp y cómo interactúan sus componentes principales.

## Arquitectura de Componentes

```mermaid
graph TB
    subgraph "Frontend"
        UI[Interfaz de Usuario<br/>HTML/CSS/JavaScript]
    end

    subgraph "Backend - Node.js"
        API[API REST<br/>Express.js]
        
        subgraph "Routers"
            R1[Películas Router]
            R2[Salas Router]
            R3[Funciones Router]
            R4[Clientes Router]
            R5[Reservas Router]
        end
        
        DB_CONN[Conexión DB<br/>MySQL2/Promise]
    end

    subgraph "Base de Datos - MySQL"
        DB[(CineApp Database)]
        
        subgraph "Tablas"
            T1[Pelicula]
            T2[Sala]
            T3[Funcion]
            T4[Cliente]
            T5[Reserva]
        end
    end

    subgraph "Testing"
        JEST[Jest Test Suite]
        TESTS[40 Tests]
    end

    %% Conexiones Frontend
    UI -->|HTTP Requests| API

    %% Conexiones Backend
    API --> R1
    API --> R2
    API --> R3
    API --> R4
    API --> R5
    
    R1 --> DB_CONN
    R2 --> DB_CONN
    R3 --> DB_CONN
    R4 --> DB_CONN
    R5 --> DB_CONN
    
    DB_CONN -->|SQL Queries| DB
    
    %% Relaciones de Base de Datos
    DB --> T1
    DB --> T2
    DB --> T3
    DB --> T4
    DB --> T5
    
    %% Testing
    JEST -.->|Prueba| API
    TESTS -.->|Verifica| DB

    %% Estilos
    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    classDef database fill:#00758f,stroke:#333,stroke-width:2px,color:#fff
    classDef testing fill:#c21325,stroke:#333,stroke-width:2px,color:#fff
    
    class UI frontend
    class API,R1,R2,R3,R4,R5,DB_CONN backend
    class DB,T1,T2,T3,T4,T5 database
    class JEST,TESTS testing
```

## Descripción de Componentes

### Frontend
- **Interfaz de Usuario**: Aplicación web construida con HTML, CSS y JavaScript vanilla
- **Comunicación**: Realiza peticiones HTTP a la API REST
- **Puerto**: Típicamente 8080 (http-server)

### Backend - API REST
- **Framework**: Express.js sobre Node.js
- **Puerto**: 3000
- **Funcionalidad**: Maneja todas las operaciones CRUD para las 5 entidades principales

#### Routers (Módulos de API)
1. **Películas Router** (`/api/peliculas`)
   - GET: Listar todas las películas
   - POST: Crear nueva película
   - GET /:id: Obtener película específica
   - PUT /:id: Actualizar película
   - DELETE /:id: Eliminar película

2. **Salas Router** (`/api/salas`)
   - CRUD completo para gestión de salas

3. **Funciones Router** (`/api/funciones`)
   - Gestión de horarios y proyecciones

4. **Clientes Router** (`/api/clientes`)
   - Administración de clientes

5. **Reservas Router** (`/api/reservas`)
   - Gestión de reservas y disponibilidad

### Base de Datos
- **Motor**: MySQL
- **Pool de Conexiones**: mysql2/promise con conexiones pooled
- **Tablas**: 5 tablas principales con relaciones FK

#### Relaciones entre Tablas
```
Pelicula (1) --> (*) Funcion
Sala (1) --> (*) Funcion
Funcion (1) --> (*) Reserva
Cliente (1) --> (*) Reserva
```

### Testing
- **Framework**: Jest
- **Cobertura**: 40 tests distribuidos en 5 suites
- **Base de Datos de Test**: Configuración separada en `.env.test`

## Flujo de Datos

### Ejemplo: Crear una Reserva

```mermaid
sequenceDiagram
    participant U as Usuario (Frontend)
    participant A as API Express
    participant R as Reservas Router
    participant D as MySQL Database

    U->>A: POST /api/reservas<br/>{funcion_id, cliente_id, numero_asientos}
    A->>R: Enrutar petición
    R->>R: Validar datos de entrada
    alt Datos inválidos
        R-->>A: 400 Bad Request
        A-->>U: Error: Datos requeridos faltantes
    else Datos válidos
        R->>D: INSERT INTO Reserva
        D-->>R: {reserva_id: 123}
        R-->>A: 201 Created
        A-->>U: {reserva_id: 123, funcion_id, cliente_id, numero_asientos}
    end
```

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | HTML5, CSS3, JavaScript | ES6+ |
| Backend | Node.js | 14+ |
| Framework Web | Express.js | 4.x |
| Base de Datos | MySQL | 8.0+ |
| Driver DB | mysql2 | Latest |
| Testing | Jest | 27+ |
| Servidor HTTP | http-server | Latest |

## Variables de Entorno

```bash
# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=CineApp

# Testing (.env.test)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=CineApp_Test
```

## Patrones de Diseño Utilizados

1. **Router Pattern**: Separación de rutas en módulos independientes
2. **Connection Pooling**: Reutilización eficiente de conexiones DB
3. **RESTful API**: Arquitectura basada en recursos y métodos HTTP
4. **Separation of Concerns**: Frontend, Backend y DB claramente separados

## Escalabilidad y Mejoras Futuras

### Posibles Mejoras
- [ ] Agregar capa de servicios (Service Layer)
- [ ] Implementar autenticación JWT
- [ ] Agregar cache con Redis
- [ ] Implementar GraphQL como alternativa a REST
- [ ] Dockerizar la aplicación
- [ ] Agregar CI/CD pipeline
- [ ] Implementar logging centralizado
- [ ] Agregar monitoreo con Prometheus/Grafana

### Escalabilidad Horizontal
```mermaid
graph LR
    LB[Load Balancer]
    
    subgraph "Backend Cluster"
        B1[API Instance 1]
        B2[API Instance 2]
        B3[API Instance N]
    end
    
    DB[(MySQL Master)]
    DB_R1[(MySQL Replica 1)]
    DB_R2[(MySQL Replica 2)]
    
    LB --> B1
    LB --> B2
    LB --> B3
    
    B1 --> DB
    B2 --> DB
    B3 --> DB
    
    DB -.-> DB_R1
    DB -.-> DB_R2
```

## Referencias

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Jest Documentation](https://jestjs.io/)
- [REST API Best Practices](https://restfulapi.net/)
