import { getSalas, createSala, updateSala, deleteSala } from '../services/salas.js';

/**
 * Renderiza la página de gestión de salas, incluyendo un formulario para crear/editar
 * y la lista de salas con opciones de edición y eliminación.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderSalasPage(container) {
    let editingSalaId = null; // Para controlar si estamos editando o creando

    const fetchAndRenderSalas = async () => {
        container.innerHTML = `
            <div class="loading-indicator">Cargando salas...</div>
        `;
        const salas = await getSalas();
        console.log('Salas recibidas:', salas);

        container.innerHTML = `
            <h1>Gestión de Salas</h1>

            <div class="form-container">
                <h2>${editingSalaId ? 'Editar Sala' : 'Crear Nueva Sala'}</h2>
                <form id="sala-form">
                    <input type="hidden" id="sala-id" value="">
                    <div class="form-group">
                        <label for="nombre-sala">Nombre de la Sala:</label>
                        <input type="text" id="nombre-sala" required>
                    </div>
                    <div class="form-group">
                        <label for="capacidad-sala">Capacidad:</label>
                        <input type="number" id="capacidad-sala" required min="1">
                    </div>
                    <button type="submit" class="btn-primary">${editingSalaId ? 'Actualizar Sala' : 'Crear Sala'}</button>
                    ${editingSalaId ? '<button type="button" id="cancel-edit" class="btn-secondary">Cancelar Edición</button>' : ''}
                </form>
            </div>

            <div id="salas-list-container">
                <h2>Salas Existentes</h2>
                <div id="salas-container" class="grid-container">
                    ${salas.length === 0 ? '<p>No hay salas para mostrar.</p>' : ''}
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        `;

        const salasContainer = container.querySelector('#salas-container');
        const salaForm = container.querySelector('#sala-form');
        const salaIdInput = container.querySelector('#sala-id');
        const nombreSalaInput = container.querySelector('#nombre-sala');
        const capacidadSalaInput = container.querySelector('#capacidad-sala');
        const messageContainer = container.querySelector('#message-container');
        const cancelEditButton = container.querySelector('#cancel-edit');

        const showMessage = (message, type = 'success') => {
            messageContainer.textContent = message;
            messageContainer.className = `message-container ${type}`;
            setTimeout(() => {
                messageContainer.textContent = '';
                messageContainer.className = 'message-container';
            }, 3000);
        };

        salas.forEach(sala => {
            const salaCard = document.createElement('div');
            salaCard.className = 'card';
            salaCard.innerHTML = `
                <h3>${sala.nombre_sala}</h3>
                <p><strong>ID:</strong> ${sala.sala_id}</p>
                <p><strong>Capacidad:</strong> ${sala.capacidad}</p>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${sala.sala_id}" data-nombre="${sala.nombre_sala}" data-capacidad="${sala.capacidad}">Editar</button>
                    <button class="btn-delete" data-id="${sala.sala_id}">Eliminar</button>
                </div>
            `;
            salasContainer.appendChild(salaCard);
        });

        salaForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombre_sala = nombreSalaInput.value;
            const capacidad = parseInt(capacidadSalaInput.value);

            if (!nombre_sala || isNaN(capacidad) || capacidad <= 0) {
                showMessage('Por favor, complete todos los campos correctamente.', 'error');
                return;
            }

            const salaData = { nombre_sala, capacidad };

            if (editingSalaId) {
                // Actualizar sala
                const updatedSala = await updateSala(editingSalaId, salaData);
                if (updatedSala) {
                    showMessage('Sala actualizada exitosamente.', 'success');
                    editingSalaId = null; // Resetear modo edición
                    salaForm.reset();
                    salaIdInput.value = '';
                    fetchAndRenderSalas(); // Volver a renderizar la lista
                } else {
                    showMessage('Error al actualizar la sala.', 'error');
                }
            } else {
                // Crear sala
                const newSala = await createSala(salaData);
                if (newSala) {
                    showMessage('Sala creada exitosamente.', 'success');
                    salaForm.reset();
                    fetchAndRenderSalas(); // Volver a renderizar la lista
                } else {
                    showMessage('Error al crear la sala.', 'error');
                }
            }
        });

        salasContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                editingSalaId = parseInt(event.target.dataset.id);
                nombreSalaInput.value = event.target.dataset.nombre;
                capacidadSalaInput.value = parseInt(event.target.dataset.capacidad);
                salaIdInput.value = editingSalaId;
                // Scroll to form
                container.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                fetchAndRenderSalas(); // Re-render to show "Cancelar Edición" button and update form title
            } else if (event.target.classList.contains('btn-delete')) {
                const salaIdToDelete = parseInt(event.target.dataset.id);
                if (confirm(`¿Está seguro de que desea eliminar la sala con ID ${salaIdToDelete}?`)) {
                    const success = await deleteSala(salaIdToDelete);
                    if (success) {
                        showMessage('Sala eliminada exitosamente.', 'success');
                        fetchAndRenderSalas(); // Volver a renderizar la lista
                    } else {
                        showMessage('Error al eliminar la sala.', 'error');
                    }
                }
            }
        });

        if (cancelEditButton) {
            cancelEditButton.addEventListener('click', () => {
                editingSalaId = null;
                salaForm.reset();
                salaIdInput.value = '';
                fetchAndRenderSalas(); // Re-render to remove "Cancelar Edición" button and reset form title
            });
        }
    };

    fetchAndRenderSalas(); // Llamada inicial para renderizar
}
