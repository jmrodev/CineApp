import { renderPeliculasPage } from './views/peliculas.js';
import { renderSalasPage } from './views/salas.js';
import { renderFuncionesPage } from './views/funciones.js';
import { renderReservasPage } from './views/reservas.js';
import { renderClientesPage } from './views/clientes.js';

const routes = {
    '#peliculas': renderPeliculasPage,
    '#salas': renderSalasPage,
    '#funciones': renderFuncionesPage,
    '#reservas': renderReservasPage,
    '#clientes': renderClientesPage,
    '': renderPeliculasPage // Default route
};

const mainContentContainer = document.getElementById('app');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmMessage = document.getElementById('confirmation-modal-message');
const confirmOkButton = document.getElementById('confirm-ok-button');
const confirmCancelButton = document.getElementById('confirm-cancel-button');
const confirmCloseButton = document.getElementById('confirm-close-button');

let currentConfirmCallback = null;

export function showConfirmModal(message, onConfirmCallback) {
    confirmMessage.textContent = message;
    confirmationModal.style.display = 'flex';
    currentConfirmCallback = onConfirmCallback;

    const handleConfirm = () => {
        if (currentConfirmCallback) {
            currentConfirmCallback();
        }
        closeConfirmModal();
    };

    const handleCancel = () => {
        closeConfirmModal();
    };

    confirmOkButton.onclick = handleConfirm;
    confirmCancelButton.onclick = handleCancel;
    confirmCloseButton.onclick = handleCancel;
    confirmationModal.onclick = (event) => {
        if (event.target === confirmationModal) {
            handleCancel();
        }
    };
}

function closeConfirmModal() {
    confirmationModal.style.display = 'none';
    confirmOkButton.onclick = null;
    confirmCancelButton.onclick = null;
    confirmCloseButton.onclick = null;
    confirmationModal.onclick = null;
    currentConfirmCallback = null;
}

function router() {
    if (!mainContentContainer) {
        console.error('El contenedor principal con id "app" no fue encontrado.');
        return;
    }

    const path = window.location.hash;
    const renderFunction = routes[path] || routes['']; // Get function or default

    // Clear previous content and render new page
    mainContentContainer.innerHTML = ''; // Clear existing content
    const pageContainer = document.createElement('div');
    pageContainer.id = path.substring(1) + '-container' || 'peliculas-container'; // Dynamic ID for specific page content
    mainContentContainer.appendChild(pageContainer);
    
    renderFunction(pageContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial route handling
    router();
    // Handle route changes
    window.addEventListener('hashchange', router);
});
