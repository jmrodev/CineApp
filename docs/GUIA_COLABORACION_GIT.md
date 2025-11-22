# 🤝 Guía de Colaboración con Git

Esta guía explica cómo trabajar en equipo con Git y GitHub para mantener el código sincronizado entre todos los colaboradores.

## 📋 Índice

- [Flujo Básico](#flujo-básico)
- [Configuración Inicial](#configuración-inicial)
- [Comandos Esenciales](#comandos-esenciales)
- [Trabajo con Ramas](#trabajo-con-ramas)
- [Resolver Conflictos](#resolver-conflictos)
- [Mejores Prácticas](#mejores-prácticas)
- [Herramientas Recomendadas](#herramientas-recomendadas)

---

## 🔄 Flujo Básico

### Para el que SUBE cambios (Push)

```bash
# 1. Guardar cambios localmente
git add .
git commit -m "Descripción clara de los cambios"

# 2. Subir a GitHub
git push origin main
```

### Para el que DESCARGA cambios (Pull)

```bash
# Descargar y fusionar cambios automáticamente
git pull origin main
```

### 🎯 Flujo Recomendado Completo

```bash
# ANTES de empezar a trabajar
git pull origin main          # Traer últimos cambios

# Trabajas en tu código...

# DESPUÉS de trabajar
git add .
git commit -m "mensaje descriptivo"
git pull origin main          # Por si hubo cambios mientras trabajabas
git push origin main          # Subir tu trabajo
```

---

## ⚙️ Configuración Inicial

### 1. Dar Acceso a Colaboradores

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Collaborators**
3. Click en **Add people**
4. Ingresa el email o usuario de GitHub del colaborador
5. El colaborador recibirá una invitación por email

### 2. Colaboradores Clonan el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/jmrodev/CineApp.git

# Entrar al directorio
cd CineApp

# Configurar nombre y email (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

---

## 📝 Comandos Esenciales

### Ver Estado del Repositorio

```bash
# Ver archivos modificados
git status

# Ver historial de commits
git log --oneline

# Ver cambios antes de commit
git diff
```

### Verificar Cambios Remotos

```bash
# Ver si hay cambios en GitHub sin descargar
git fetch origin

# Ver diferencia entre local y remoto
git log HEAD..origin/main

# Si hay cambios, descargarlos
git pull origin main
```

### Gestión de Cambios

```bash
# Agregar archivos específicos
git add archivo.js

# Agregar todos los cambios
git add .

# Commit con mensaje
git commit -m "Agrego validación de email"

# Subir cambios
git push origin main
```

### Deshacer Cambios

```bash
# Descartar cambios en un archivo (antes de commit)
git checkout -- archivo.js

# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Deshacer último commit (elimina cambios)
git reset --hard HEAD~1

# Ver quién modificó qué
git blame archivo.js
```

---

## 🌿 Trabajo con Ramas

Las ramas permiten trabajar en features sin afectar el código principal.

### Crear y Usar Ramas

```bash
# Ver todas las ramas
git branch -a

# Crear nueva rama y cambiar a ella
git checkout -b feature/nueva-funcionalidad

# O en dos pasos:
git branch feature/nueva-funcionalidad
git checkout feature/nueva-funcionalidad

# Trabajar normalmente en la rama
git add .
git commit -m "Implemento nueva funcionalidad"

# Subir rama a GitHub
git push origin feature/nueva-funcionalidad
```

### Fusionar Ramas

```bash
# Volver a la rama principal
git checkout main

# Traer últimos cambios
git pull origin main

# Fusionar tu rama
git merge feature/nueva-funcionalidad

# Subir cambios fusionados
git push origin main

# Opcional: Eliminar rama local
git branch -d feature/nueva-funcionalidad

# Opcional: Eliminar rama remota
git push origin --delete feature/nueva-funcionalidad
```

### Pull Requests (Recomendado)

En lugar de fusionar localmente, usa Pull Requests en GitHub:

1. Sube tu rama: `git push origin feature/mi-rama`
2. Ve a GitHub → **Pull Requests** → **New Pull Request**
3. Selecciona tu rama
4. Describe los cambios
5. Solicita revisión de tus colaboradores
6. Una vez aprobado, haz **Merge** desde GitHub

---

## 🚨 Resolver Conflictos

Los conflictos ocurren cuando dos personas modifican las mismas líneas de código.

### Detectar un Conflicto

```bash
git pull origin main

# Si hay conflicto, verás:
# CONFLICT (content): Merge conflict in archivo.js
# Automatic merge failed; fix conflicts and then commit the result.
```

### Resolver el Conflicto

1. **Abre el archivo con conflicto**

```javascript
function login(username, password) {
<<<<<<< HEAD
    // Tu código
    return authenticateUser(username, password);
=======
    // Código del colaborador
    return validateAndAuthenticate(username, password);
>>>>>>> origin/main
}
```

2. **Decide qué código mantener** (edita manualmente)

```javascript
function login(username, password) {
    // Quedarte con uno, el otro, o combinar ambos
    return validateAndAuthenticate(username, password);
}
```

3. **Marca como resuelto**

```bash
git add archivo.js
git commit -m "Resuelvo conflicto en función login"
git push origin main
```

### Evitar Conflictos

- ✅ Comunicarse: "Voy a editar `backend/routers/clientes.js`"
- ✅ Trabajar en archivos diferentes cuando sea posible
- ✅ Hacer `git pull` frecuentemente
- ✅ Usar ramas para features grandes

---

## 💡 Mejores Prácticas

### ✅ Hacer

1. **Pull antes de empezar a trabajar**
   ```bash
   git pull origin main
   ```

2. **Commits frecuentes y descriptivos**
   ```bash
   git commit -m "Agrego validación de email en formulario de registro"
   ```
   Mejor que: `git commit -m "cambios"`

3. **Push al final del día**
   ```bash
   git push origin main
   ```

4. **Revisar antes de commit**
   ```bash
   git status
   git diff
   ```

5. **Usar ramas para features grandes**
   ```bash
   git checkout -b feature/sistema-pagos
   ```

### ❌ Evitar

1. ❌ Trabajar días sin hacer pull
2. ❌ Modificar el mismo archivo al mismo tiempo sin avisar
3. ❌ Hacer push sin hacer pull primero
4. ❌ Commits gigantes con 50 archivos modificados
5. ❌ Mensajes de commit vagos: "fix", "cambios", "update"

---

## 🛠️ Herramientas Recomendadas

### 1. GitHub Desktop (Más Fácil)

**Ventajas:**
- Interfaz gráfica intuitiva
- Muestra cambios visualmente
- Sincroniza automáticamente
- Ideal para principiantes

**Descargar:** https://desktop.github.com/

**Uso básico:**
1. Abre GitHub Desktop
2. File → Clone Repository
3. Haz cambios en tu código
4. Verás los cambios en la pestaña "Changes"
5. Escribe un mensaje de commit
6. Click en "Commit to main"
7. Click en "Push origin"

### 2. VS Code + Git (Integrado)

**Ventajas:**
- Ya está en tu editor
- Ve cambios mientras codeas
- Pull/Push con un click

**Uso básico:**
1. Abre la pestaña "Source Control" (Ctrl+Shift+G)
2. Verás archivos modificados
3. Click en "+" para agregar al staging
4. Escribe mensaje de commit
5. Click en ✓ para commit
6. Click en "..." → Push

### 3. GitKraken (Profesional)

**Ventajas:**
- Visualización de ramas
- Resolución de conflictos visual
- Interfaz muy profesional

**Descargar:** https://www.gitkraken.com/

---

## 🔔 Notificaciones de Cambios

### Opción 1: GitHub Watch (Email)

1. Ve a tu repositorio en GitHub
2. Click en **Watch** (arriba a la derecha)
3. Selecciona **All Activity**
4. Recibirás emails de cada push

### Opción 2: Verificación Manual

```bash
# Verificar si hay cambios (no descarga)
git fetch origin

# Ver estado
git status
# Mostrará: "Your branch is behind 'origin/main' by X commits"

# Si hay cambios, descargar
git pull origin main
```

### Opción 3: Script Automático

Crea un script que verifique cada hora:

```bash
#!/bin/bash
# Archivo: check-updates.sh

cd /ruta/a/tu/proyecto
git fetch origin

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse origin/main)

if [ $LOCAL != $REMOTE ]; then
    echo "¡Hay cambios nuevos! Ejecuta: git pull origin main"
    # Opcional: notificación de sistema
    notify-send "Git" "Hay cambios nuevos en el repositorio"
fi
```

---

## 📊 Flujo de Trabajo Diario

### Cada Mañana

```bash
# 1. Ir al directorio del proyecto
cd CineApp

# 2. Traer últimos cambios
git pull origin main

# 3. Ver qué cambió
git log --oneline -5

# 4. Empezar a trabajar
```

### Durante el Día

```bash
# Después de completar una tarea:
git add .
git commit -m "Descripción específica de lo que hiciste"

# Opcional: Subir inmediatamente
git push origin main
```

### Al Final del Día

```bash
# 1. Asegurarse de que todo está commiteado
git status

# 2. Traer posibles cambios de otros
git pull origin main

# 3. Subir tu trabajo
git push origin main
```

---

## 🎓 Comandos de Referencia Rápida

```bash
# Estado y logs
git status                    # Ver archivos modificados
git log --oneline            # Ver historial
git diff                     # Ver cambios sin commit

# Sincronización
git pull origin main         # Descargar + fusionar
git push origin main         # Subir cambios
git fetch origin            # Solo descargar (sin fusionar)

# Commits
git add .                    # Agregar todos los cambios
git add archivo.js           # Agregar archivo específico
git commit -m "mensaje"      # Crear commit

# Ramas
git branch                   # Ver ramas locales
git branch -a               # Ver todas las ramas
git checkout -b nueva-rama  # Crear y cambiar a rama
git checkout main           # Cambiar a main
git merge otra-rama         # Fusionar rama

# Deshacer
git checkout -- archivo.js   # Descartar cambios
git reset --soft HEAD~1      # Deshacer último commit
git reset --hard HEAD~1      # Deshacer y eliminar cambios

# Información
git remote -v               # Ver repositorios remotos
git blame archivo.js        # Ver quién modificó qué
git show commit-hash        # Ver detalles de commit
```

---

## ❓ Preguntas Frecuentes

### ¿Con qué frecuencia debo hacer pull?

- **Ideal:** Antes de empezar a trabajar cada día
- **Mínimo:** Antes de hacer push
- **Recomendado:** Cada 2-3 horas si están trabajando activamente

### ¿Qué hago si olvidé hacer pull antes de commit?

```bash
git pull origin main
# Git intentará fusionar automáticamente
# Si hay conflicto, resuélvelo y continúa
```

### ¿Cómo sé si mis cambios se subieron correctamente?

1. Ve a GitHub y verifica que aparezcan tus commits
2. O usa: `git log origin/main` y compara con `git log`

### ¿Puedo ver los cambios antes de hacer pull?

```bash
git fetch origin
git log HEAD..origin/main --oneline
git diff HEAD origin/main
```

### ¿Qué pasa si hago push al mismo tiempo que otro colaborador?

Git rechazará tu push y te pedirá hacer pull primero:
```bash
git pull origin main   # Fusiona los cambios
git push origin main   # Ahora sí funcionará
```

---

## 📞 Soporte

Si tienes problemas:
1. Lee los mensajes de error de Git (suelen ser claros)
2. Usa `git status` para ver el estado
3. Consulta esta guía
4. Pregunta en el grupo/chat del equipo
5. Google el mensaje de error

---

## 🎉 ¡Listo!

Ahora tu equipo puede trabajar colaborativamente sin perder cambios. Recuerda:

✅ **Pull frecuentemente**  
✅ **Commits claros y frecuentes**  
✅ **Comunicación constante**  
✅ **Usar ramas para cambios grandes**

---

> 💡 **Tip:** Guarda esta guía en favoritos y compártela con tus colaboradores.
