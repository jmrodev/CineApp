import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/clientes.js';
import { showConfirmModal } from '../main.js';

/**
 * Renderiza la página de gestión de clientes, incluyendo un formulario para crear/editar
 * y la lista de clientes con opciones de edición y eliminación.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderClientesPage(container) {
    let editingClienteId = null; // Para controlar si estamos editando o creando

    const fetchAndRenderClientes = async () => {
        container.innerHTML = `
            <div class="loading-indicator">Cargando clientes...</div>
        `;
        const clientes = await getClientes();
        console.log('Clientes recibidos:', clientes);

        container.innerHTML = `
            <h1>Gestión de Clientes</h1>

            <button id="add-cliente-btn" class="btn-primary">Añadir Nuevo Cliente</button>

            <div class="modal-overlay" id="cliente-form-modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <div class="form-section">
                        <h2 id="modal-title">${editingClienteId ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
                        <form id="cliente-form">
                            <input type="hidden" id="cliente-id" value="">
                            <div class="form-group">
                                <label for="nombre-cliente">Nombre:</label>
                                <input type="text" id="nombre-cliente" required>
                            </div>
                            <div class="form-group">
                                <label for="apellido-cliente">Apellido:</label>
                                <input type="text" id="apellido-cliente">
                            </div>
                            <div class="form-group">
                                <label for="email-cliente">Email:</label>
                                <input type="email" id="email-cliente" required>
                            </div>
                            <div class="form-group">
                                <label for="telefono-cliente">Teléfono:</label>
                                <input type="text" id="telefono-cliente">
                            </div>
                            <button type="submit" class="btn-primary" id="submit-cliente-form">${editingClienteId ? 'Actualizar Cliente' : 'Crear Cliente'}</button>
                            <button type="button" id="cancel-edit" class="btn-secondary">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div id="clientes-list-container">
                <h2>Clientes Existentes</h2>
                <div id="clientes-container" class="grid-container">
                    ${clientes.length === 0 ? '<p>No hay clientes para mostrar.</p>' : ''}
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        `;

        const clienteFormModal = container.querySelector('#cliente-form-modal');
        const addClienteBtn = container.querySelector('#add-cliente-btn');
        const closeButton = container.querySelector('.close-button');
        const clienteForm = container.querySelector('#cliente-form');
        const clientesContainer = container.querySelector('#clientes-container');
        const cancelEditButton = container.querySelector('#cancel-edit');
        const modalTitle = container.querySelector('#modal-title');
        const submitClienteFormBtn = container.querySelector('#submit-cliente-form');
        const messageContainer = container.querySelector('#message-container');

        const clienteIdInput = container.querySelector('#cliente-id');
        const nombreClienteInput = container.querySelector('#nombre-cliente');
        const apellidoClienteInput = container.querySelector('#apellido-cliente');
        const emailClienteInput = container.querySelector('#email-cliente');
        const telefonoClienteInput = container.querySelector('#telefono-cliente');

        const showMessage = (message, type = 'success') => {
            messageContainer.textContent = message;
            messageContainer.className = `message-container ${type}`;
            setTimeout(() => {
                messageContainer.textContent = '';
                messageContainer.className = 'message-container';
            }, 3000);
        };

        const openModal = () => {
            clienteFormModal.style.display = 'flex';
        };

        const closeModal = () => {
            clienteFormModal.style.display = 'none';
            clienteForm.reset();
            editingClienteId = null;
            clienteIdInput.value = '';
            modalTitle.textContent = 'Crear Nuevo Cliente';
            submitClienteFormBtn.textContent = 'Crear Cliente';
        };

        // Initial load of clients
        // await fetchAndRenderClientes(); // This is already called at the end of the outer function

        // Event listeners for modal
        addClienteBtn.addEventListener('click', () => {
            closeModal(); // Ensure form is reset
            openModal();
        });
        closeButton.addEventListener('click', closeModal);
        cancelEditButton.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === clienteFormModal) {
                closeModal();
            }
        });

        clientes.forEach(cliente => {
            const clienteCard = document.createElement('div');
            clienteCard.className = 'card';
            clienteCard.innerHTML = `
                <h3>${cliente.nombre_cliente} ${cliente.apellido || ''}</h3>
                <p><strong>ID:</strong> ${cliente.cliente_id}</p>
                <p><strong>Email:</strong> ${cliente.email}</p>
                ${cliente.telefono ? `<p><strong>Teléfono:</strong> ${cliente.telefono}</p>` : ''}
                <div class="card-actions">
                    <button class="btn-edit" data-id="${cliente.cliente_id}" 
                            data-nombre="${cliente.nombre_cliente}" 
                            data-apellido="${cliente.apellido || ''}"
                            data-email="${cliente.email}"
                            data-telefono="${cliente.telefono || ''}">Editar</button>
                    <button class="btn-delete" data-id="${cliente.cliente_id}">Eliminar</button>
                </div>
            `;
            clientesContainer.appendChild(clienteCard);
        });

        clienteForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombre_cliente = nombreClienteInput.value;
            const apellido = apellidoClienteInput.value;
            const email = emailClienteInput.value;
            const telefono = telefonoClienteInput.value;

            if (!nombre_cliente || !email) {
                showMessage('Por favor, complete los campos de Nombre y Email correctamente.', 'error');
                return;
            }

            const clienteData = { nombre_cliente, apellido, email, telefono };

            if (editingClienteId) {
                // Actualizar cliente
                const updatedCliente = await updateCliente(editingClienteId, clienteData);
                if (updatedCliente) {
                    showMessage('Cliente actualizado exitosamente.', 'success');
                } else {
                    showMessage('Error al actualizar el cliente.', 'error');
                }
            } else {
                // Crear cliente
                const newCliente = await createCliente(clienteData);
                if (newCliente) {
                    showMessage('Cliente creado exitosamente.', 'success');
                } else {
                    showMessage('Error al crear el cliente.', 'error');
                }
            }

            closeModal();
            await fetchAndRenderClientes(); // Volver a renderizar la lista
        });

        clientesContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                editingClienteId = parseInt(event.target.dataset.id);
                nombreClienteInput.value = event.target.dataset.nombre;
                apellidoClienteInput.value = event.target.dataset.apellido;
                emailClienteInput.value = event.target.dataset.email;
                telefonoClienteInput.value = event.target.dataset.telefono;
                clienteIdInput.value = editingClienteId;
                
                modalTitle.textContent = 'Editar Cliente';
                submitClienteFormBtn.textContent = 'Actualizar Cliente';
                openModal();
            } else if (event.target.classList.contains('btn-delete')) {
                const clienteIdToDelete = parseInt(event.target.dataset.id);
                showConfirmModal(`¿Está seguro de que desea eliminar el cliente con ID ${clienteIdToDelete}?`, async () => {
                    const success = await deleteCliente(clienteIdToDelete);
                    if (success) {
                        showMessage('Cliente eliminado exitosamente.', 'success');
                        await fetchAndRenderClientes(); // Volver a renderizar la lista
                    } else {
                        showMessage('Error al eliminar el cliente.', 'error');
                    }
                });
            }
        });
    };

    fetchAndRenderClientes(); // Llamada inicial para renderizar
}
