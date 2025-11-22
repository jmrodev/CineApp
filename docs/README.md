# 📚 Documentación CineApp

Esta carpeta contiene toda la documentación técnica y diagramas del proyecto.

## 📁 Contenido

### 📊 Diagramas

- **[data_flow_diagram.md](./data_flow_diagram.md)** - Diagrama de Flujo de Datos (DFD)
  - Muestra cómo fluyen los datos a través del sistema
  - Nivel 0: Diagrama de contexto
  - Nivel 1: Descomposición del sistema

- **[use_case_diagram.md](./use_case_diagram.md)** - Diagrama de Casos de Uso
  - Describe las interacciones entre actores y el sistema
  - Casos de uso del Cliente
  - Casos de uso del Administrador

- **[workflow_diagram.md](./workflow_diagram.md)** - Diagrama de Flujo de Trabajo
  - Flujo completo del proceso de reserva
  - Desde la selección de película hasta la confirmación

- **[docs.html](./docs.html)** - Documentación HTML generada
  - Vista completa de la documentación en formato web

### 📖 Guías

- **[GUIA_CREACION_DIAGRAMAS.md](./GUIA_CREACION_DIAGRAMAS.md)** - 🆕 Guía completa
  - Aprende a crear diagramas con Mermaid
  - Plantillas y ejemplos
  - Herramientas recomendadas
  - Solución de problemas

## 🔍 Visualizar los Diagramas

### En GitHub
Los diagramas Mermaid se renderizan automáticamente al ver los archivos `.md` en GitHub.

### En VS Code
Instala la extensión **Markdown Preview Mermaid Support**:
```bash
code --install-extension bierner.markdown-mermaid
```

### Online
Usa el [Mermaid Live Editor](https://mermaid.live/) para editar y visualizar en tiempo real.

## 🎯 Propósito de Cada Diagrama

| Diagrama | Cuándo Usarlo | Audiencia |
|----------|--------------|-----------|
| **UML** | Diseño de base de datos | Desarrolladores, DBAs |
| **Data Flow** | Entender flujo de información | Todo el equipo |
| **Use Case** | Definir requerimientos | Product Owners, Stakeholders |
| **Workflow** | Procesos de negocio | UX/UI, Product Owners |

## 🛠️ Crear Nuevos Diagramas

Consulta la **[Guía de Creación de Diagramas](./GUIA_CREACION_DIAGRAMAS.md)** para:
- Sintaxis de Mermaid
- Plantillas listas para usar
- Mejores prácticas
- Ejemplos del proyecto

## 📝 Convenciones

1. **Formato**: Todos los diagramas usan sintaxis Mermaid
2. **Nombres**: Descriptivos y en español
3. **Estructura**: Título + Diagrama + Descripción textual
4. **Versionado**: Todos los cambios trackeados con Git

## 🔄 Actualización

Los diagramas deben actualizarse cuando:
- Se modifica la estructura de la base de datos
- Se agregan nuevas funcionalidades
- Cambian los flujos de trabajo
- Se descubren inconsistencias con el código

## 📞 Contacto

Para sugerencias o correcciones en la documentación, abre un issue en el repositorio.

---

> 💡 **Tip**: Siempre revisa los diagramas antes de implementar nuevas features para asegurar consistencia con el diseño.
