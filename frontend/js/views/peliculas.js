import { getPeliculas } from '../services/peliculas.js';

/**
 * Obtiene las películas y las renderiza en el contenedor proporcionado.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderPeliculasPage(container) {
    container.innerHTML = '<p>Cargando películas...</p>';

    const movies = await getPeliculas();
    console.log('Películas recibidas:', movies);

    if (movies.length === 0) {
        container.innerHTML = '<p>No hay películas para mostrar.</p>';
        return;
    }

    const moviesHtml = movies.map(movie => {
        return `
            <div class="movie-card">
                <h2>${movie.titulo}</h2>
                <p><strong>Género:</strong> ${movie.genero}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = moviesHtml;
}
