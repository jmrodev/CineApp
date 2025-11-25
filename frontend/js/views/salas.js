import { getSalas } from '../services/salas.js';

/**
 * Obtiene las salas y las renderiza en el contenedor proporcionado.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderSalasPage(container) {
    container.innerHTML = '<p>Cargando salas...</p>';

    const salas = await getSalas();
    console.log('Salas recibidas:', salas);

    if (salas.length === 0) {
        container.innerHTML = '<p>No hay salas para mostrar.</p>';
        return;
    }

    const salasHtml = salas.map(sala => {
        return `
            <div class="card">
                <h2>${sala.nombre_sala}</h2>
                <p><strong>Capacidad:</strong> ${sala.capacidad}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h1>Salas Disponibles</h1>
        <div id="salas-container" class="grid-container">
            ${salasHtml}
        </div>
    `;
}
