import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/clientes.js';

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

            <div class="form-container">
                <h2>${editingClienteId ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
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
                    <button type="submit" class="btn-primary">${editingClienteId ? 'Actualizar Cliente' : 'Crear Cliente'}</button>
                    ${editingClienteId ? '<button type="button" id="cancel-edit" class="btn-secondary">Cancelar Edición</button>' : ''}
                </form>
            </div>

            <div id="clientes-list-container">
                <h2>Clientes Existentes</h2>
                <div id="clientes-container" class="grid-container">
                    ${clientes.length === 0 ? '<p>No hay clientes para mostrar.</p>' : ''}
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        `;

        const clientesContainer = container.querySelector('#clientes-container');
        const clienteForm = container.querySelector('#cliente-form');
        const clienteIdInput = container.querySelector('#cliente-id');
        const nombreClienteInput = container.querySelector('#nombre-cliente');
        const apellidoClienteInput = container.querySelector('#apellido-cliente');
        const emailClienteInput = container.querySelector('#email-cliente');
        const telefonoClienteInput = container.querySelector('#telefono-cliente');
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
                    editingClienteId = null; // Resetear modo edición
                    clienteForm.reset();
                    clienteIdInput.value = '';
                    fetchAndRenderClientes(); // Volver a renderizar la lista
                } else {
                    showMessage('Error al actualizar el cliente.', 'error');
                }
            } else {
                // Crear cliente
                const newCliente = await createCliente(clienteData);
                if (newCliente) {
                    showMessage('Cliente creado exitosamente.', 'success');
                    clienteForm.reset();
                    fetchAndRenderClientes(); // Volver a renderizar la lista
                } else {
                    showMessage('Error al crear el cliente.', 'error');
                }
            }
        });

        clientesContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                editingClienteId = parseInt(event.target.dataset.id);
                nombreClienteInput.value = event.target.dataset.nombre;
                apellidoClienteInput.value = event.target.dataset.apellido;
                emailClienteInput.value = event.target.dataset.email;
                telefonoClienteInput.value = event.target.dataset.telefono;
                clienteIdInput.value = editingClienteId;
                // Scroll to form
                container.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                fetchAndRenderClientes(); // Re-render to show "Cancelar Edición" button and update form title
            } else if (event.target.classList.contains('btn-delete')) {
                const clienteIdToDelete = parseInt(event.target.dataset.id);
                if (confirm(`¿Está seguro de que desea eliminar el cliente con ID ${clienteIdToDelete}?`)) {
                    const success = await deleteCliente(clienteIdToDelete);
                    if (success) {
                        showMessage('Cliente eliminado exitosamente.', 'success');
                        fetchAndRenderClientes(); // Volver a renderizar la lista
                    } else {
                        showMessage('Error al eliminar el cliente.', 'error');
                    }
                }
            }
        });

        if (cancelEditButton) {
            cancelEditButton.addEventListener('click', () => {
                editingClienteId = null;
                clienteForm.reset();
                clienteIdInput.value = '';
                fetchAndRenderClientes(); // Re-render to remove "Cancelar Edición" button and reset form title
            });
        }
    };

    fetchAndRenderClientes(); // Llamada inicial para renderizar
}
