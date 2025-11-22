# ⚡ Configuración Rápida - Workflow con Rebase

Este documento contiene los comandos esenciales para configurar Git con rebase.

## 🚀 Setup Rápido (Solo una vez)

```bash
# Configurar Git para usar rebase por defecto
git config --global pull.rebase true

# Configurar nombre y email (si no lo hiciste)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Opcional: Colores en terminal
git config --global color.ui auto

# Opcional: Editor preferido
git config --global core.editor "code --wait"  # VS Code
# o
git config --global core.editor "nano"         # Nano
```

## 📋 Comandos del Día a Día

```bash
# INICIO DEL DÍA
cd CineApp
git pull --rebase origin main

# DURANTE EL TRABAJO
git add .
git commit -m "Descripción clara"

# FIN DEL DÍA (o cuando termines una tarea)
git pull --rebase origin main
git push origin main
```

## 🔧 Resolver Conflictos en Rebase

```bash
# Si hay conflicto:
# 1. Editar archivos con conflicto
# 2. Marcar como resuelto:
git add archivo-con-conflicto.js

# 3. Continuar rebase:
git rebase --continue

# O abortar si es muy complicado:
git rebase --abort
```

## 🌿 Trabajo con Ramas

```bash
# Crear y cambiar a nueva rama
git checkout -b feature/mi-feature

# Trabajar normalmente
git add .
git commit -m "Implemento feature"

# Mantener actualizada con main
git fetch origin
git rebase origin/main

# Cuando termines, volver a main
git checkout main
git pull --rebase origin main
git rebase feature/mi-feature
git push origin main

# Eliminar rama
git branch -d feature/mi-feature
```

## 💡 Tips Rápidos

```bash
# Ver estado
git status

# Ver historial
git log --oneline --graph

# Ver cambios no commiteados
git diff

# Deshacer cambios locales (antes de commit)
git checkout -- archivo.js

# Ver configuración actual
git config --list
```

## ⚠️ Reglas Importantes

1. ✅ Siempre `pull --rebase` antes de `push`
2. ✅ Commits pequeños y frecuentes
3. ✅ Mensajes de commit descriptivos
4. ❌ NO rebase de commits ya pusheados que otros descargaron
5. ❌ NO trabajes en el mismo archivo al mismo tiempo sin avisar

## 🆘 Emergencias

```bash
# Si algo salió mal con rebase
git rebase --abort

# Ver historial completo (incluyendo deshacer)
git reflog

# Volver a un estado anterior
git reset --hard HEAD@{1}

# Crear backup antes de algo arriesgado
git branch backup-antes-rebase
```

## 📞 Ayuda Rápida

- **Guía completa:** `docs/GUIA_COLABORACION_GIT.md`
- **Documentación Git:** https://git-scm.com/docs
- **Visualizador de Git:** https://git-school.github.io/visualizing-git/

---

> 💡 **Tip:** Guarda este archivo como referencia rápida en tus marcadores
