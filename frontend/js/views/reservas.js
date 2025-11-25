import { getReservas } from '../services/reservas.js';

/**
 * Obtiene las reservas y las renderiza en el contenedor proporcionado.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderReservasPage(container) {
    container.innerHTML = '<p>Cargando reservas...</p>';

    const reservas = await getReservas();
    console.log('Reservas recibidas:', reservas);

    if (reservas.length === 0) {
        container.innerHTML = '<p>No hay reservas para mostrar.</p>';
        return;
    }

    const reservasHtml = reservas.map(reserva => {
        return `
            <div class="card">
                <h2>Reserva #${reserva.reserva_id}</h2>
                <p><strong>Función ID:</strong> ${reserva.funcion_id}</p>
                <p><strong>Cliente ID:</strong> ${reserva.cliente_id}</p>
                <p><strong>Asientos:</strong> ${reserva.numero_asientos}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h1>Mis Reservas</h1>
        <div id="reservas-container" class="grid-container">
            ${reservasHtml}
        </div>
    `;
}
