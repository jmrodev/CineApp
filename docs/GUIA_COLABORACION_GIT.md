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

### Para el que DESCARGA cambios (Pull con Rebase)

```bash
# Descargar y aplicar cambios con rebase (mantiene historial limpio)
git pull --rebase origin main
```

### 🎯 Flujo Recomendado Completo

```bash
# ANTES de empezar a trabajar
git pull --rebase origin main          # Traer últimos cambios con rebase

# Trabajas en tu código...

# DESPUÉS de trabajar
git add .
git commit -m "mensaje descriptivo"
git pull --rebase origin main          # Por si hubo cambios mientras trabajabas
git push origin main                    # Subir tu trabajo
```

**¿Por qué usar rebase?**
- ✅ Historial lineal y limpio (sin merge commits)
- ✅ Más fácil de leer el historial
- ✅ Commits se reorganizan de forma cronológica

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

# Si hay cambios, descargarlos con rebase
git pull --rebase origin main
```

### Gestión de Cambios

```bash
# Agregar archivos específicos
git add archivo.js

# Agregar todos los cambios
git add .

# Commit con mensaje
git commit -m "Agrego validación de email"

# Subir cambios (después de pull --rebase)
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

## 🚨 Resolver Conflictos (con Rebase)

Los conflictos ocurren cuando dos personas modifican las mismas líneas de código.

### Detectar un Conflicto con Rebase

```bash
git pull --rebase origin main

# Si hay conflicto, verás:
# CONFLICT (content): Merge conflict in archivo.js
# error: could not apply abc1234... tu mensaje de commit
# Resolve all conflicts manually, mark them as resolved with
# "git add/rm <conflicted_files>", then run "git rebase --continue"
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
>>>>>>> abc1234 (mensaje del commit remoto)
}
```

2. **Decide qué código mantener** (edita manualmente)

```javascript
function login(username, password) {
    // Quedarte con uno, el otro, o combinar ambos
    return validateAndAuthenticate(username, password);
}
```

3. **Marca como resuelto y continúa el rebase**

```bash
# Agregar archivos resueltos
git add archivo.js

# Continuar el rebase
git rebase --continue

# Si hay más conflictos, repite el proceso
# Si quieres abortar el rebase:
git rebase --abort
```

4. **Subir cambios**

```bash
git push origin main
```

### Comandos útiles durante Rebase

```bash
# Ver estado del rebase
git status

# Saltar un commit durante rebase (si ya se aplicó)
git rebase --skip

# Abortar y volver al estado original
git rebase --abort

# Ver qué commits se están aplicando
git rebase --show-current-patch
```

### Evitar Conflictos

- ✅ Comunicarse: "Voy a editar `backend/routers/clientes.js`"
- ✅ Trabajar en archivos diferentes cuando sea posible
- ✅ Hacer `git pull --rebase` frecuentemente
- ✅ Usar ramas para features grandes
- ✅ Commits pequeños y frecuentes (más fácil de rebase)

---

## 💡 Mejores Prácticas

### ✅ Hacer

1. **Pull con rebase antes de empezar a trabajar**
   ```bash
   git pull --rebase origin main
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

# 2. Traer últimos cambios con rebase
git pull --rebase origin main

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
git pull --rebase origin main  # Por si hubo cambios
git push origin main
```

### Al Final del Día

```bash
# 1. Asegurarse de que todo está commiteado
git status

# 2. Traer posibles cambios de otros con rebase
git pull --rebase origin main

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
git pull --rebase origin main    # Descargar + rebase (recomendado)
git pull origin main             # Descargar + merge (crea merge commits)
git push origin main             # Subir cambios
git fetch origin                 # Solo descargar (sin fusionar)

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

# Rebase
git rebase main                  # Rebase de rama actual sobre main
git rebase --continue            # Continuar después de resolver conflictos
git rebase --abort               # Abortar rebase y volver al inicio
git rebase -i HEAD~3             # Rebase interactivo últimos 3 commits

# Deshacer
git checkout -- archivo.js   # Descartar cambios
git reset --soft HEAD~1      # Deshacer último commit (mantiene cambios)
git reset --hard HEAD~1      # Deshacer y eliminar cambios
git revert commit-hash       # Crear commit que deshace otro commit
```

---

## ❓ Preguntas Frecuentes

### ¿Con qué frecuencia debo hacer pull?

- **Ideal:** Antes de empezar a trabajar cada día
- **Mínimo:** Antes de hacer push
- **Recomendado:** Cada 2-3 horas si están trabajando activamente

### ¿Qué hago si olvidé hacer pull antes de commit?

```bash
git pull --rebase origin main
# Git intentará aplicar tus commits sobre los nuevos cambios
# Si hay conflicto, resuélvelo y continúa con: git rebase --continue
```

### ¿Por qué usar rebase en lugar de merge?

**Rebase (`git pull --rebase`):**
- ✅ Historial lineal y limpio
- ✅ Sin commits de merge innecesarios
- ✅ Más fácil de leer el historial
- ❌ No usar en ramas públicas compartidas

**Merge (`git pull`):**
- ✅ Preserva el historial completo
- ✅ Más seguro para principiantes
- ❌ Crea commits de merge que "ensucian" el historial

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
git pull --rebase origin main   # Aplica tus commits sobre los nuevos
git push origin main             # Ahora sí funcionará
```

### ¿Qué hacer si el rebase se complica?

Si durante el rebase hay muchos conflictos o algo sale mal:
```bash
# Abortar y volver al estado antes del rebase
git rebase --abort

# Luego puedes intentar con merge normal
git pull origin main
```

### ¿Cuándo NO usar rebase?

❌ No uses rebase en:
- Commits que ya subiste y otros ya descargaron
- Ramas públicas donde varios colaboran simultáneamente
- Si no estás seguro de lo que estás haciendo

✅ Usa rebase para:
- Sincronizar tu rama local antes de push
- Limpiar tu historial local antes de compartir
- Mantener un historial lineal del proyecto

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

---

## 🔄 Configurar Git para usar Rebase por Defecto

Para que `git pull` use rebase automáticamente sin necesidad de especificar `--rebase` cada vez:

### Configuración Global (para todos los repositorios)

```bash
git config --global pull.rebase true
```

### Configuración por Repositorio (solo para CineApp)

```bash
cd CineApp
git config pull.rebase true
```

### Verificar la configuración

```bash
# Ver configuración actual
git config --get pull.rebase

# Ver todas las configuraciones
git config --list | grep rebase
```

### Opciones de configuración

```bash
# Usar rebase siempre
git config pull.rebase true

# Usar merge siempre (comportamiento por defecto)
git config pull.rebase false

# Quitar la configuración
git config --unset pull.rebase
```

---

## 🎓 Rebase Interactivo (Avanzado)

El rebase interactivo permite reorganizar, editar o combinar commits antes de compartirlos.

### Casos de uso

```bash
# Editar los últimos 3 commits
git rebase -i HEAD~3

# Rebase desde un commit específico
git rebase -i abc1234
```

### Comandos disponibles en rebase interactivo

Cuando ejecutas `git rebase -i`, se abre un editor con tus commits:

```
pick abc1234 Agrego validación
pick def5678 Corrijo bug
pick ghi9012 Mejoro documentación

# Comandos disponibles:
# p, pick = usar commit
# r, reword = usar commit, pero editar mensaje
# e, edit = usar commit, pero pausar para editar
# s, squash = usar commit, pero fusionar con el anterior
# f, fixup = como squash, pero descartar mensaje
# d, drop = eliminar commit
```

### Ejemplos comunes

**Combinar últimos 3 commits en uno:**
```bash
git rebase -i HEAD~3

# Cambia en el editor:
pick abc1234 Commit 1
squash def5678 Commit 2
squash ghi9012 Commit 3

# Guarda y cierra. Git te pedirá un mensaje para el commit combinado
```

**Editar mensaje del último commit:**
```bash
git commit --amend -m "Nuevo mensaje"
```

**Cambiar orden de commits:**
```bash
git rebase -i HEAD~3

# En el editor, simplemente reordena las líneas
pick ghi9012 Commit 3
pick abc1234 Commit 1
pick def5678 Commit 2
```

---

## 🎯 Flujo de Trabajo Recomendado con Rebase

### Flujo Simple (Trabajo Individual)

```bash
# Mañana
git pull --rebase origin main

# Durante el día (commits frecuentes)
git add .
git commit -m "Feature X: parte 1"
# ... más trabajo ...
git add .
git commit -m "Feature X: parte 2"

# Antes de push (opcional: limpiar historial)
git rebase -i HEAD~2  # Combinar los 2 commits en uno

# Subir
git pull --rebase origin main
git push origin main
```

### Flujo con Ramas (Features)

```bash
# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Trabajar en la rama
git add .
git commit -m "Implemento feature"

# Actualizar desde main periódicamente
git fetch origin
git rebase origin/main

# Cuando termines, volver a main
git checkout main
git pull --rebase origin main

# Fusionar tu rama (con rebase)
git rebase feature/nueva-funcionalidad

# O usar merge si prefieres
git merge feature/nueva-funcionalidad

# Subir
git push origin main

# Eliminar rama
git branch -d feature/nueva-funcionalidad
```

---

## ⚠️ Reglas de Oro con Rebase

### ✅ SÍ hacer rebase:

1. **Antes de push** - Para sincronizar con cambios remotos
   ```bash
   git pull --rebase origin main
   ```

2. **En commits locales** - Que aún no compartiste
   ```bash
   git rebase -i HEAD~3
   ```

3. **Para mantener historial limpio** - En tu rama feature
   ```bash
   git rebase main
   ```

### ❌ NUNCA hacer rebase:

1. **En commits públicos** - Que otros ya descargaron
   ```bash
   # ❌ NO HACER si otros tienen estos commits
   git rebase -i HEAD~10
   ```

2. **En rama main compartida** - Si varios trabajan en ella simultáneamente

3. **Si no estás seguro** - En caso de duda, usa merge

### 🔄 Si algo sale mal:

```bash
# Abortar rebase en progreso
git rebase --abort

# Volver a estado anterior (antes del rebase)
git reflog  # Busca el SHA del estado anterior
git reset --hard SHA_anterior
```

---

## 📊 Comparación: Rebase vs Merge

### Historial con Merge

```
* commit 5 - Merge branch 'feature'
|\
| * commit 4 - Feature commit
* | commit 3 - Main commit
|/
* commit 2
* commit 1
```

### Historial con Rebase

```
* commit 4 - Feature commit (reaplicado)
* commit 3 - Main commit
* commit 2
* commit 1
```

**Ventajas de Rebase:**
- ✅ Historial lineal y fácil de leer
- ✅ No hay commits de merge
- ✅ Bisect (buscar bugs) es más fácil

**Ventajas de Merge:**
- ✅ Preserva el contexto histórico
- ✅ Más seguro (no reescribe historia)
- ✅ Mejor para ramas públicas

---

## 💾 Comandos de Emergencia

### Si arruinaste algo con rebase

```bash
# Ver historial de todo lo que hiciste
git reflog

# Resultado:
# abc1234 HEAD@{0}: rebase: Feature commit
# def5678 HEAD@{1}: commit: Main commit
# ghi9012 HEAD@{2}: pull: Fast-forward  ← Estado antes del rebase

# Volver a estado anterior
git reset --hard HEAD@{2}
# o
git reset --hard ghi9012
```

### Si hay conflictos complicados

```bash
# Ver qué archivos tienen conflictos
git status

# Ver el conflicto específico
git diff

# Herramientas visuales para resolver conflictos
git mergetool

# Si es muy complicado, abortar
git rebase --abort
```

### Backup antes de rebase arriesgado

```bash
# Crear rama de backup
git branch backup-antes-rebase

# Hacer el rebase
git rebase -i HEAD~10

# Si algo sale mal:
git checkout backup-antes-rebase
```

---

