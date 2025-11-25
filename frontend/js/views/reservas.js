import { getReservas, createReserva, updateReserva, deleteReserva } from '../services/reservas.js';
import { getClientes } from '../services/clientes.js';
import { getFunciones } from '../services/funciones.js';
import { getPeliculas } from '../services/peliculas.js'; // Import getPeliculas
import { showConfirmModal } from '../main.js';

/**
 * Renderiza la página de gestión de reservas, incluyendo un formulario para crear/editar
 * y la lista de reservas con opciones de edición y eliminación.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderReservasPage(container) {
    let editingReservaId = null; // Para controlar si estamos editando o creando
    let currentFilters = {}; // Para mantener el estado de los filtros

    const fetchAndRenderReservas = async () => {
        container.innerHTML = `
            <div class="loading-indicator">Cargando reservas...</div>
        `;
        const [reservas, clientes, funciones, peliculas] = await Promise.all([ // Fetch peliculas
            getReservas(currentFilters), // Pasar filtros actuales
            getClientes(),
            getFunciones(),
            getPeliculas() // Fetch peliculas
        ]);
        console.log('Reservas recibidas:', reservas);
        console.log('Clientes recibidos:', clientes);
        console.log('Funciones recibidas:', funciones);
        console.log('Películas recibidas:', peliculas);

        container.innerHTML = `
            <h1>Gestión de Reservas</h1>

            <button id="add-reserva-btn" class="btn-primary">Añadir Nueva Reserva</button>

            <div class="modal-overlay" id="reserva-form-modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <div class="form-section">
                        <h2 id="modal-title">${editingReservaId ? 'Editar Reserva' : 'Crear Nueva Reserva'}</h2>
                        <form id="reserva-form">
                            <input type="hidden" id="reserva-id" value="">
                            <div class="form-group">
                                <label for="cliente-id">Cliente:</label>
                                <select id="cliente-id" required>
                                    <option value="">Seleccione un cliente</option>
                                    ${clientes.map(cliente => `<option value="${cliente.cliente_id}">${cliente.nombre_cliente} ${cliente.apellido || ''}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="funcion-id">Función:</label>
                                <select id="funcion-id" required>
                                    <option value="">Seleccione una función</option>
                                    ${funciones.map(funcion => {
                                        const pelicula = peliculas.find(p => p.pelicula_id === funcion.pelicula_id);
                                        const peliculaTitulo = pelicula ? pelicula.titulo : 'Desconocida';
                                        return `<option value="${funcion.funcion_id}">${peliculaTitulo} - ${new Date(funcion.horario).toLocaleString()}</option>`;
                                    }).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="numero-asientos">Número de Asientos:</label>
                                <input type="number" id="numero-asientos" required min="1">
                            </div>
                            <button type="submit" class="btn-primary" id="submit-reserva-form">${editingReservaId ? 'Actualizar Reserva' : 'Crear Reserva'}</button>
                            <button type="button" id="cancel-edit" class="btn-secondary">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="filter-container">
                <h2>Filtrar Reservas</h2>
                <div class="form-group">
                    <label for="filter-cliente-id">Filtrar por Cliente:</label>
                    <select id="filter-cliente-id">
                        <option value="">Todos los Clientes</option>
                        ${clientes.map(cliente => `<option value="${cliente.cliente_id}" ${currentFilters.cliente_id == cliente.cliente_id ? 'selected' : ''}>${cliente.nombre_cliente} ${cliente.apellido || ''}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="filter-funcion-id">Filtrar por Función:</label>
                    <select id="filter-funcion-id">
                        <option value="">Todas las Funciones</option>
                        ${funciones.map(funcion => {
                            const pelicula = peliculas.find(p => p.pelicula_id === funcion.pelicula_id);
                            const peliculaTitulo = pelicula ? pelicula.titulo : 'Desconocida';
                            return `<option value="${funcion.funcion_id}" ${currentFilters.funcion_id == funcion.funcion_id ? 'selected' : ''}>${peliculaTitulo} - ${new Date(funcion.horario).toLocaleString()}</option>`;
                        }).join('')}
                    </select>
                </div>
                <button type="button" id="apply-filters" class="btn-primary">Aplicar Filtros</button>
                <button type="button" id="clear-filters" class="btn-secondary">Limpiar Filtros</button>
            </div>

            <div id="reservas-list-container">
                <h2>Reservas Existentes</h2>
                <div id="reservas-container" class="grid-container">
                    ${reservas.length === 0 ? '<p>No hay reservas para mostrar.</p>' : ''}
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        `;

        const reservaFormModal = container.querySelector('#reserva-form-modal');
        const addReservaBtn = container.querySelector('#add-reserva-btn');
        const closeButton = container.querySelector('.close-button');
        const reservaForm = container.querySelector('#reserva-form');
        const reservasContainer = container.querySelector('#reservas-container');
        const cancelEditButton = container.querySelector('#cancel-edit');
        const modalTitle = container.querySelector('#modal-title');
        const submitReservaFormBtn = container.querySelector('#submit-reserva-form');
        const messageContainer = container.querySelector('#message-container');

        const reservaIdInput = container.querySelector('#reserva-id');
        const clienteIdSelect = container.querySelector('#cliente-id');
        const funcionIdSelect = container.querySelector('#funcion-id');
        const numeroAsientosInput = container.querySelector('#numero-asientos');

        const filterClienteIdSelect = container.querySelector('#filter-cliente-id');
        const filterFuncionIdSelect = container.querySelector('#filter-funcion-id');
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
            reservaFormModal.style.display = 'flex';
        };

        const closeModal = () => {
            reservaFormModal.style.display = 'none';
            reservaForm.reset();
            editingReservaId = null;
            reservaIdInput.value = '';
            modalTitle.textContent = 'Crear Nueva Reserva';
            submitReservaFormBtn.textContent = 'Crear Reserva';
        };

        // Event listeners for modal
        addReservaBtn.addEventListener('click', () => {
            closeModal(); // Ensure form is reset
            openModal();
        });
        closeButton.addEventListener('click', closeModal);
        cancelEditButton.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === reservaFormModal) {
                closeModal();
            }
        });

        reservas.forEach(reserva => {
            const cliente = clientes.find(c => c.cliente_id === reserva.cliente_id);
            const funcion = funciones.find(f => f.funcion_id === reserva.funcion_id);
            const pelicula = funcion ? peliculas.find(p => p.pelicula_id === funcion.pelicula_id) : null; // Find pelicula
            const funcionDetails = funcion ? `${pelicula ? pelicula.titulo : 'Desconocida'} - ${new Date(funcion.horario).toLocaleString()}` : 'Función Desconocida';

            const reservaCard = document.createElement('div');
            reservaCard.className = 'card';
            reservaCard.innerHTML = `
                <h3>Reserva #${reserva.reserva_id}</h3>
                <p><strong>Cliente:</strong> ${cliente ? `${cliente.nombre_cliente} ${cliente.apellido || ''}` : 'Desconocido'}</p>
                <p><strong>Función:</strong> ${funcionDetails}</p>
                <p><strong>Asientos:</strong> ${reserva.numero_asientos}</p>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${reserva.reserva_id}" 
                            data-cliente-id="${reserva.cliente_id}" 
                            data-funcion-id="${reserva.funcion_id}" 
                            data-numero-asientos="${reserva.numero_asientos}">Editar</button>
                    <button class="btn-delete" data-id="${reserva.reserva_id}">Eliminar</button>
                </div>
            `;
            reservasContainer.appendChild(reservaCard);
        });

        reservaForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cliente_id = parseInt(clienteIdSelect.value);
            const funcion_id = parseInt(funcionIdSelect.value);
            const numero_asientos = parseInt(numeroAsientosInput.value);

            if (!cliente_id || !funcion_id || isNaN(numero_asientos) || numero_asientos <= 0) {
                showMessage('Por favor, complete todos los campos correctamente.', 'error');
                return;
            }

            const reservaData = { cliente_id, funcion_id, numero_asientos };

            if (editingReservaId) {
                // Actualizar reserva
                const updatedReserva = await updateReserva(editingReservaId, reservaData);
                if (updatedReserva) {
                    showMessage('Reserva actualizada exitosamente.', 'success');
                } else {
                    showMessage('Error al actualizar la reserva.', 'error');
                }
            } else {
                // Crear reserva
                const newReserva = await createReserva(reservaData);
                if (newReserva) {
                    showMessage('Reserva creada exitosamente.', 'success');
                } else {
                    showMessage('Error al crear la reserva.', 'error');
                }
            }

            closeModal();
            await fetchAndRenderReservas(); // Volver a renderizar la lista
        });

        reservasContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                editingReservaId = parseInt(event.target.dataset.id);
                clienteIdSelect.value = event.target.dataset.clienteId;
                funcionIdSelect.value = event.target.dataset.funcionId;
                numeroAsientosInput.value = parseInt(event.target.dataset.numeroAsientos);
                reservaIdInput.value = editingReservaId;
                
                modalTitle.textContent = 'Editar Reserva';
                submitReservaFormBtn.textContent = 'Actualizar Reserva';
                openModal();
            } else if (event.target.classList.contains('btn-delete')) {
                const reservaIdToDelete = parseInt(event.target.dataset.id);
                showConfirmModal(`¿Está seguro de que desea eliminar la reserva con ID ${reservaIdToDelete}?`, async () => {
                    const success = await deleteReserva(reservaIdToDelete);
                    if (success) {
                        showMessage('Reserva eliminada exitosamente.', 'success');
                        await fetchAndRenderReservas(); // Volver a renderizar la lista
                    } else {
                        showMessage('Error al eliminar la reserva.', 'error');
                    }
                });
            }
        });

        applyFiltersButton.addEventListener('click', () => {
            currentFilters = {};
            if (filterClienteIdSelect.value) {
                currentFilters.cliente_id = filterClienteIdSelect.value;
            }
            if (filterFuncionIdSelect.value) {
                currentFilters.funcion_id = filterFuncionIdSelect.value;
            }
            fetchAndRenderReservas();
        });

        clearFiltersButton.addEventListener('click', () => {
            currentFilters = {};
            filterClienteIdSelect.value = '';
            filterFuncionIdSelect.value = '';
            fetchAndRenderReservas();
        });
    };

    fetchAndRenderReservas(); // Llamada inicial para renderizar
}
