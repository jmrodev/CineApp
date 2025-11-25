import { getFunciones } from '../services/funciones.js';

/**
 * Obtiene las funciones y las renderiza en el contenedor proporcionado.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderFuncionesPage(container) {
    container.innerHTML = '<p>Cargando funciones...</p>';

    const funciones = await getFunciones();
    console.log('Funciones recibidas:', funciones);

    if (funciones.length === 0) {
        container.innerHTML = '<p>No hay funciones para mostrar.</p>';
        return;
    }

    const funcionesHtml = funciones.map(funcion => {
        return `
            <div class="card">
                <h2>Función #${funcion.funcion_id}</h2>
                <p><strong>Película ID:</strong> ${funcion.pelicula_id}</p>
                <p><strong>Sala ID:</strong> ${funcion.sala_id}</p>
                <p><strong>Horario:</strong> ${new Date(funcion.horario).toLocaleString()}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h1>Funciones Disponibles</h1>
        <div id="funciones-container" class="grid-container">
            ${funcionesHtml}
        </div>
    `;
}
