# CineApp

## Sistema de Venta de Entradas de Cine con Reservas Anticipadas
Diseña una aplicación que permita gestionar la venta de entradas en un cine. Cada película tiene
un título, género, horario y sala. Los clientes pueden reservar entradas para una
película específica con anticipación y se debe mostrar cuántas entradas quedan
disponibles por sala. Además, permite ver cuáles son las películas más reservadas

## 👥 Colaboradores

Este proyecto es desarrollado y mantenido por:

| Avatar | Nombre | GitHub | Rol |
|--------|--------|--------|-----|
| <img src="https://avatars.githubusercontent.com/u/32540750?v=4" width="50" height="50" style="border-radius: 50%"> | **Juan Marcelo Rodriguez** | [@jmrodev](https://github.com/jmrodev) | Colaborador |
| <img src="https://avatars.githubusercontent.com/u/83104313?v=4" width="50" height="50" style="border-radius: 50%"> | **fer0809** | [@fer0809](https://github.com/fer0809) | Colaborador |
| <img src="https://avatars.githubusercontent.com/u/171627636?v=4" width="50" height="50" style="border-radius: 50%"> | **JuanIRodri** | [@JuanIRodri](https://github.com/JuanIRodri) | Colaborador |

### 🤝 Cómo Contribuir

Si eres colaborador del proyecto, consulta la [Guía de Colaboración con Git](./docs/GUIA_COLABORACION_GIT.md) para conocer el flujo de trabajo.

**Comandos básicos:**
```bash
# Obtener últimos cambios
git pull --rebase origin main

# Trabajar y subir cambios
git add .
git commit -m "Descripción de cambios"
git pull --rebase origin main
git push origin main
```


## Clonar el Proyecto

Para obtener una copia local de este proyecto, puedes usar GitHub CLI o Git.

### Con GitHub CLI
Si tienes GitHub CLI instalado, abre tu terminal y ejecuta:
```bash
gh repo clone https://github.com/jmrodev/CineApp.git
```

### Con Git
Si prefieres usar Git, abre tu terminal y ejecuta:
```bash
git clone https://github.com/jmrodev/CineApp.git
```

## Estructura del Proyecto

```
CineApp/
├── backend/          # Servidor API REST con Node.js + Express
├── frontend/         # Interfaz de usuario (HTML/CSS/JS)
├── database/         # Scripts y diagramas de base de datos
│   ├── database.sql          # Script de creación de tablas
│   └── database_uml.md       # Diagrama UML de la base de datos
├── docs/             # Documentación y diagramas
│   ├── data_flow_diagram.md
│   ├── use_case_diagram.md
│   ├── workflow_diagram.md
│   └── docs.html
├── Openapi/          # Especificación OpenAPI de la API
└── README.md
```

## Instrucciones de Inicio

### Base de Datos
1. Asegúrate de tener MySQL instalado y corriendo.
2. Ejecuta el script de creación de la base de datos:
   ```bash
   mysql -u root -p < database/database.sql
   ```

### Backend
Para iniciar el servidor backend, sigue estos pasos:
1. Abre una terminal y navega al directorio `backend`.
2. Ejecuta `npm install` para instalar las dependencias.
3. Configura las variables de entorno (opcional):
   - Crea un archivo `.env` con las credenciales de tu base de datos MySQL:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=tu_contraseña
     DB_NAME=CineApp
     ```
4. Ejecuta `node index.js` para iniciar el servidor.

### Frontend
Para iniciar la aplicación frontend con un servidor local:
1. Instala `http-server` globalmente (si no lo has hecho antes):
   ```
   sudo npm install http-server -g
   ```
   (Puede que necesites usar `sudo` en Linux o macOS)
2. Navega al directorio `frontend`.
3. Inicia el servidor:
   ```
   http-server
   ```
4. Abre tu navegador y ve a la dirección que se muestra en la terminal (generalmente http://127.0.0.1:8080).

## Ejecutar Tests

El proyecto incluye una suite completa de tests para verificar el funcionamiento de la API.

### Prerrequisitos para Tests
1. Asegúrate de tener una base de datos MySQL configurada para tests.
2. El archivo `.env.test` en el directorio `backend` contiene la configuración de la base de datos de prueba.

### Ejecutar todos los tests
```bash
cd backend
npm test
```

### Detalles de los Tests
Los tests cubren todas las funcionalidades del sistema:
- **tests/peliculas.test.js** - CRUD de películas
- **tests/salas.test.js** - CRUD de salas
- **tests/funciones.test.js** - CRUD de funciones
- **tests/clientes.test.js** - CRUD de clientes
- **tests/reservas.test.js** - CRUD de reservas

### Resultado Esperado
```
Test Suites: 5 passed, 5 total
Tests:       40 passed, 40 total
```

## 📚 Documentación

El proyecto incluye documentación completa con diagramas técnicos:

- **[Arquitectura del Sistema](./docs/arquitectura_sistema.md)** - Vista general de componentes
- **[Diagrama UML de Base de Datos](./database/database_uml.md)** - Estructura de tablas
- **[Diagrama de Flujo de Datos](./docs/data_flow_diagram.md)** - Flujo de información
- **[Casos de Uso](./docs/use_case_diagram.md)** - Interacciones del sistema
- **[Flujo de Trabajo](./docs/workflow_diagram.md)** - Proceso de reserva
- **[Especificación OpenAPI](./Openapi/openapi.yaml)** - Documentación de la API

### 📖 Guía para Crear Diagramas
Si necesitas crear o modificar diagramas, consulta la **[Guía de Creación de Diagramas](./docs/GUIA_CREACION_DIAGRAMAS.md)** que incluye:
- Sintaxis de Mermaid
- Plantillas y ejemplos
- Herramientas recomendadas
- Solución de problemas comunes

### 🤝 Trabajo Colaborativo
Para trabajar en equipo con Git y mantener el código sincronizado, consulta la **[Guía de Colaboración con Git](./docs/GUIA_COLABORACION_GIT.md)** que incluye:
- Flujo básico de pull/push
- Trabajo con ramas
- Resolución de conflictos
- Mejores prácticas
- Herramientas recomendadas (GitHub Desktop, VS Code)
