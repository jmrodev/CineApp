import { getSalas, createSala, updateSala, deleteSala } from '../services/salas.js';
import { showConfirmModal } from '../main.js';

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

            <button id="add-sala-btn" class="btn-primary">Añadir Nueva Sala</button>

            <div class="modal-overlay" id="sala-form-modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <div class="form-section">
                        <h2 id="modal-title">${editingSalaId ? 'Editar Sala' : 'Crear Nueva Sala'}</h2>
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
                            <button type="submit" class="btn-primary" id="submit-sala-form">${editingSalaId ? 'Actualizar Sala' : 'Crear Sala'}</button>
                            <button type="button" id="cancel-edit" class="btn-secondary">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div id="salas-list-container">
                <h2>Salas Existentes</h2>
                <div id="salas-container" class="grid-container">
                    ${salas.length === 0 ? '<p>No hay salas para mostrar.</p>' : ''}
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        `;

        const salaFormModal = container.querySelector('#sala-form-modal');
        const addSalaBtn = container.querySelector('#add-sala-btn');
        const closeButton = container.querySelector('.close-button');
        const salaForm = container.querySelector('#sala-form');
        const salasContainer = container.querySelector('#salas-container');
        const cancelEditButton = container.querySelector('#cancel-edit');
        const modalTitle = container.querySelector('#modal-title');
        const submitSalaFormBtn = container.querySelector('#submit-sala-form');
        const messageContainer = container.querySelector('#message-container');

        const salaIdInput = container.querySelector('#sala-id');
        const nombreSalaInput = container.querySelector('#nombre-sala');
        const capacidadSalaInput = container.querySelector('#capacidad-sala');

        const showMessage = (message, type = 'success') => {
            messageContainer.textContent = message;
            messageContainer.className = `message-container ${type}`;
            setTimeout(() => {
                messageContainer.textContent = '';
                messageContainer.className = 'message-container';
            }, 3000);
        };

        const openModal = () => {
            salaFormModal.style.display = 'flex';
        };

        const closeModal = () => {
            salaFormModal.style.display = 'none';
            salaForm.reset();
            editingSalaId = null;
            salaIdInput.value = '';
            modalTitle.textContent = 'Crear Nueva Sala';
            submitSalaFormBtn.textContent = 'Crear Sala';
        };

        // Event listeners for modal
        addSalaBtn.addEventListener('click', () => {
            closeModal(); // Ensure form is reset
            openModal();
        });
        closeButton.addEventListener('click', closeModal);
        cancelEditButton.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === salaFormModal) {
                closeModal();
            }
        });

        salas.forEach(sala => {
            const salaCard = document.createElement('div');
            salaCard.className = 'card';
            let funcionesHtml = '';
            if (sala.funciones && sala.funciones.length > 0) {
                funcionesHtml = '<h4>Funciones:</h4><ul>';
                sala.funciones.forEach(funcion => {
                    funcionesHtml += `<li>${funcion.pelicula_titulo} - ${new Date(funcion.horario).toLocaleString()}</li>`;
                });
                funcionesHtml += '</ul>';
            } else {
                funcionesHtml = '<p>No hay funciones programadas.</p>';
            }

            salaCard.innerHTML = `
                <h3>${sala.nombre_sala}</h3>
                <p><strong>ID:</strong> ${sala.sala_id}</p>
                <p><strong>Capacidad:</strong> ${sala.capacidad}</p>
                ${funcionesHtml}
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
                } else {
                    showMessage('Error al actualizar la sala.', 'error');
                }
            } else {
                // Crear sala
                const newSala = await createSala(salaData);
                if (newSala) {
                    showMessage('Sala creada exitosamente.', 'success');
                } else {
                    showMessage('Error al crear la sala.', 'error');
                }
            }

            closeModal();
            await fetchAndRenderSalas(); // Volver a renderizar la lista
        });

        salasContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                editingSalaId = parseInt(event.target.dataset.id);
                nombreSalaInput.value = event.target.dataset.nombre;
                capacidadSalaInput.value = parseInt(event.target.dataset.capacidad);
                salaIdInput.value = editingSalaId;
                
                modalTitle.textContent = 'Editar Sala';
                submitSalaFormBtn.textContent = 'Actualizar Sala';
                openModal();
            } else if (event.target.classList.contains('btn-delete')) {
                const salaIdToDelete = parseInt(event.target.dataset.id);
                showConfirmModal(`¿Está seguro de que desea eliminar la sala con ID ${salaIdToDelete}?`, async () => {
                    const success = await deleteSala(salaIdToDelete);
                    if (success) {
                        showMessage('Sala eliminada exitosamente.', 'success');
                        await fetchAndRenderSalas(); // Volver a renderizar la lista
                    } else {
                        showMessage('Error al eliminar la sala.', 'error');
                    }
                });
            }
        });
    };

    fetchAndRenderSalas(); // Llamada inicial para renderizar
}
