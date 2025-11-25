import { getFunciones, createFuncion, updateFuncion, deleteFuncion } from '../services/funciones.js';
import { getPeliculas } from '../services/peliculas.js';
import { getSalas } from '../services/salas.js';
import { showConfirmModal } from '../main.js';

/**
 * Formats a Date object into a string suitable for datetime-local input.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string (YYYY-MM-DDTHH:MM).
 */
function formatDatetimeLocal(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Renderiza la página de gestión de funciones, incluyendo un formulario para crear/editar
 * y la lista de funciones con opciones de edición y eliminación.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderFuncionesPage(container) {
    let editingFuncionId = null; // Para controlar si estamos editando o creando
    let currentFilters = {}; // Para mantener el estado de los filtros

    const fetchAndRenderFunciones = async () => {
        container.innerHTML = `
            <div class="loading-indicator">Cargando funciones...</div>
        `;
        const [funciones, peliculas, salas] = await Promise.all([
            getFunciones(currentFilters), // Pasar filtros actuales
            getPeliculas(),
            getSalas()
        ]);
        console.log('Funciones recibidas:', funciones);
        console.log('Películas recibidas:', peliculas);
        console.log('Salas recibidas:', salas);

        container.innerHTML = `
            <h1>Gestión de Funciones</h1>

            <button id="add-funcion-btn" class="btn-primary">Añadir Nueva Función</button>

            <div class="modal-overlay" id="funcion-form-modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <div class="form-section">
                        <h2 id="modal-title">${editingFuncionId ? 'Editar Función' : 'Crear Nueva Función'}</h2>
                        <form id="funcion-form">
                            <input type="hidden" id="funcion-id" value="">
                            <div class="form-group">
                                <label for="pelicula-id">Película:</label>
                                <select id="pelicula-id" required>
                                    <option value="">Seleccione una película</option>
                                    ${peliculas.map(pelicula => `<option value="${pelicula.pelicula_id}">${pelicula.titulo}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="sala-id">Sala:</label>
                                <select id="sala-id" required>
                                    <option value="">Seleccione una sala</option>
                                    ${salas.map(sala => `<option value="${sala.sala_id}">${sala.nombre_sala} (Capacidad: ${sala.capacidad})</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="horario">Horario:</label>
                                <input type="datetime-local" id="horario" required>
                            </div>
                            <button type="submit" class="btn-primary" id="submit-funcion-form">${editingFuncionId ? 'Actualizar Función' : 'Crear Función'}</button>
                            <button type="button" id="cancel-edit" class="btn-secondary">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="filter-container">
                <h2>Filtrar Funciones</h2>
                <div class="form-group">
                    <label for="filter-pelicula-id">Filtrar por Película:</label>
                    <select id="filter-pelicula-id">
                        <option value="">Todas las Películas</option>
                        ${peliculas.map(pelicula => `<option value="${pelicula.pelicula_id}" ${currentFilters.pelicula_id == pelicula.pelicula_id ? 'selected' : ''}>${pelicula.titulo}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="filter-sala-id">Filtrar por Sala:</label>
                    <select id="filter-sala-id">
                        <option value="">Todas las Salas</option>
                        ${salas.map(sala => `<option value="${sala.sala_id}" ${currentFilters.sala_id == sala.sala_id ? 'selected' : ''}>${sala.nombre_sala}</option>`).join('')}
                    </select>
                </div>
                <button type="button" id="apply-filters" class="btn-primary">Aplicar Filtros</button>
                <button type="button" id="clear-filters" class="btn-secondary">Limpiar Filtros</button>
            </div>

            <div id="funciones-list-container">
                <h2>Funciones Existentes</h2>
                <div id="funciones-container" class="grid-container">
                    ${funciones.length === 0 ? '<p>No hay funciones para mostrar.</p>' : ''}
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        `;

        const funcionFormModal = container.querySelector('#funcion-form-modal');
        const addFuncionBtn = container.querySelector('#add-funcion-btn');
        const closeButton = container.querySelector('.close-button');
        const funcionForm = container.querySelector('#funcion-form');
        const funcionesContainer = container.querySelector('#funciones-container');
        const cancelEditButton = container.querySelector('#cancel-edit');
        const modalTitle = container.querySelector('#modal-title');
        const submitFuncionFormBtn = container.querySelector('#submit-funcion-form');
        const messageContainer = container.querySelector('#message-container');

        const funcionIdInput = container.querySelector('#funcion-id');
        const peliculaIdSelect = container.querySelector('#pelicula-id');
        const salaIdSelect = container.querySelector('#sala-id');
        const horarioInput = container.querySelector('#horario');

        const filterPeliculaIdSelect = container.querySelector('#filter-pelicula-id');
        const filterSalaIdSelect = container.querySelector('#filter-sala-id');
        const applyFiltersButton = container.querySelector('#apply-filters');
        const clearFiltersButton = container.querySelector('#clear-filters');

        const showMessage = (message, type = 'success') => {
            messageContainer.textContent = message;
            messageContainer.className = `message-container ${type}`;
            setTimeout(() => {
                messageContainer.textContent = '';
                messageContainer.className = 'message-container';
            }, 3000);
        };

        const openModal = () => {
            funcionFormModal.style.display = 'flex';
        };

        const closeModal = () => {
            funcionFormModal.style.display = 'none';
            funcionForm.reset();
            editingFuncionId = null;
            funcionIdInput.value = '';
            modalTitle.textContent = 'Crear Nueva Función';
            submitFuncionFormBtn.textContent = 'Crear Función';
        };

        // Event listeners for modal
        addFuncionBtn.addEventListener('click', () => {
            closeModal(); // Ensure form is reset
            openModal();
        });
        closeButton.addEventListener('click', closeModal);
        cancelEditButton.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === funcionFormModal) {
                closeModal();
            }
        });

        funciones.forEach(funcion => {
            // The backend now provides pelicula_titulo and sala_capacidad directly
            const peliculaTitulo = funcion.pelicula_titulo || 'Desconocida';
            const salaNombre = salas.find(s => s.sala_id === funcion.sala_id)?.nombre_sala || 'Desconocida';
            const formattedHorario = new Date(funcion.horario).toLocaleString();
            const asientosRestantes = funcion.sala_capacidad - funcion.asientos_reservados;

            const funcionCard = document.createElement('div');
            funcionCard.className = 'card';
            funcionCard.innerHTML = `
                <h3>Función #${funcion.funcion_id}</h3>
                <p><strong>Película:</strong> ${peliculaTitulo}</p>
                <p><strong>Sala:</strong> ${salaNombre} (Capacidad: ${funcion.sala_capacidad})</p>
                <p><strong>Horario:</strong> ${formattedHorario}</p>
                <p><strong>Asientos Restantes:</strong> ${asientosRestantes}</p>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${funcion.funcion_id}" 
                            data-pelicula-id="${funcion.pelicula_id}" 
                            data-sala-id="${funcion.sala_id}" 
                            data-horario="${formatDatetimeLocal(new Date(funcion.horario))}">Editar</button>
                    <button class="btn-delete" data-id="${funcion.funcion_id}">Eliminar</button>
                </div>
            `;
            funcionesContainer.appendChild(funcionCard);
        });

        funcionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const pelicula_id = parseInt(peliculaIdSelect.value);
            const sala_id = parseInt(salaIdSelect.value);
            const horario = horarioInput.value; // ISO 8601 string from datetime-local

            if (!pelicula_id || !sala_id || !horario) {
                showMessage('Por favor, complete todos los campos correctamente.', 'error');
                return;
            }

            const funcionData = { pelicula_id, sala_id, horario };

            if (editingFuncionId) {
                // Actualizar función
                const updatedFuncion = await updateFuncion(editingFuncionId, funcionData);
                if (updatedFuncion) {
                    showMessage('Función actualizada exitosamente.', 'success');
                } else {
                    showMessage('Error al actualizar la función.', 'error');
                }
            } else {
                // Crear función
                const newFuncion = await createFuncion(funcionData);
                if (newFuncion) {
                    showMessage('Función creada exitosamente.', 'success');
                } else {
                    showMessage('Error al crear la función.', 'error');
                }
            }

            closeModal();
            await fetchAndRenderFunciones(); // Volver a renderizar la lista
        });

        funcionesContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                editingFuncionId = parseInt(event.target.dataset.id);
                peliculaIdSelect.value = event.target.dataset.peliculaId;
                salaIdSelect.value = event.target.dataset.salaId;
                horarioInput.value = event.target.dataset.horario; // Already formatted for datetime-local
                funcionIdInput.value = editingFuncionId;
                
                modalTitle.textContent = 'Editar Función';
                submitFuncionFormBtn.textContent = 'Actualizar Función';
                openModal();
            } else if (event.target.classList.contains('btn-delete')) {
                const funcionIdToDelete = parseInt(event.target.dataset.id);
                showConfirmModal(`¿Está seguro de que desea eliminar la función con ID ${funcionIdToDelete}?`, async () => {
                    try {
                        const success = await deleteFuncion(funcionIdToDelete);
                        if (success) {
                            showMessage('Función eliminada exitosamente.', 'success');
                            await fetchAndRenderFunciones(); // Volver a renderizar la lista
                        } else {
                            // This case should ideally not be reached if deleteFuncion throws on error
                            showMessage('Error al eliminar la función.', 'error');
                        }
                    } catch (error) {
                        showMessage(`Error al eliminar la función: ${error.message}`, 'error');
                    }
                });
            }
        });

        applyFiltersButton.addEventListener('click', () => {
            currentFilters = {};
            if (filterPeliculaIdSelect.value) {
                currentFilters.pelicula_id = filterPeliculaIdSelect.value;
            }
            if (filterSalaIdSelect.value) {
                currentFilters.sala_id = filterSalaIdSelect.value;
            }
            fetchAndRenderFunciones();
        });

        clearFiltersButton.addEventListener('click', () => {
            currentFilters = {};
            filterPeliculaIdSelect.value = '';
            filterSalaIdSelect.value = '';
            fetchAndRenderFunciones();
        });
    };

    fetchAndRenderFunciones(); // Llamada inicial para renderizar
}
