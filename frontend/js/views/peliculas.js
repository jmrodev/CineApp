import { getPeliculas, createPelicula, updatePelicula, deletePelicula, getPeliculaById } from '../services/peliculas.js';

let currentEditingMovieId = null;

/**
 * Renderiza la página de gestión de películas.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderPeliculasPage(container) {
    container.innerHTML = `
        <div class="peliculas-management">
            <h1>Gestión de Películas</h1>

            <div class="form-section">
                <h2>${currentEditingMovieId ? 'Editar Película' : 'Añadir Nueva Película'}</h2>
                <form id="movie-form">
                    <input type="hidden" id="movie-id">
                    <label for="titulo">Título:</label>
                    <input type="text" id="titulo" required>
                    <label for="genero">Género:</label>
                    <input type="text" id="genero" required>
                    <label for="imagen">URL de Imagen:</label>
                    <input type="text" id="imagen">
                    <button type="submit">${currentEditingMovieId ? 'Actualizar Película' : 'Añadir Película'}</button>
                    <button type="button" id="cancel-edit" style="display:none;">Cancelar Edición</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Listado de Películas</h2>
                <div id="movies-list" class="movie-cards-container">
                    <p>Cargando películas...</p>
                </div>
            </div>
        </div>
    `;

    const movieForm = container.querySelector('#movie-form');
    const moviesListContainer = container.querySelector('#movies-list');
    const cancelEditButton = container.querySelector('#cancel-edit');

    // Initial load of movies
    await loadMovies(moviesListContainer);

    // Event listener for form submission
    movieForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const movieId = document.getElementById('movie-id').value;
        const titulo = document.getElementById('titulo').value;
        const genero = document.getElementById('genero').value;
        const imagen = document.getElementById('imagen').value;

        const movieData = { titulo, genero, imagen };

        if (movieId) {
            // Update existing movie
            await updatePelicula(parseInt(movieId), movieData);
        } else {
            // Create new movie
            await createPelicula(movieData);
        }

        // Clear form and reset editing state
        movieForm.reset();
        currentEditingMovieId = null;
        movieForm.querySelector('button[type="submit"]').textContent = 'Añadir Película';
        cancelEditButton.style.display = 'none';

        await loadMovies(moviesListContainer); // Reload movies after add/update
    });

    // Event listener for cancel edit button
    cancelEditButton.addEventListener('click', () => {
        movieForm.reset();
        currentEditingMovieId = null;
        movieForm.querySelector('button[type="submit"]').textContent = 'Añadir Película';
        cancelEditButton.style.display = 'none';
        document.getElementById('movie-id').value = '';
    });
}

/**
 * Carga y renderiza la lista de películas.
 * @param {HTMLElement} moviesListContainer - El contenedor donde se renderizarán las películas.
 */
async function loadMovies(moviesListContainer) {
    moviesListContainer.innerHTML = '<p>Cargando películas...</p>';
    const movies = await getPeliculas();

    if (movies.length === 0) {
        moviesListContainer.innerHTML = '<p>No hay películas para mostrar.</p>';
        return;
    }

    moviesListContainer.innerHTML = movies.map(movie => `
        <div class="movie-card">
            ${movie.imagen ? `<img src="${movie.imagen}" alt="${movie.titulo}" class="movie-image">` : ''}
            <h2>${movie.titulo}</h2>
            <p><strong>Género:</strong> ${movie.genero}</p>
            <div class="movie-actions">
                <button class="edit-movie" data-id="${movie.pelicula_id}">Editar</button>
                <button class="delete-movie" data-id="${movie.pelicula_id}">Eliminar</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for edit and delete buttons
    moviesListContainer.querySelectorAll('.edit-movie').forEach(button => {
        button.addEventListener('click', async (event) => {
            const movieId = event.target.dataset.id;
            const movie = await getPeliculaById(parseInt(movieId));
            if (movie) {
                document.getElementById('movie-id').value = movie.pelicula_id;
                document.getElementById('titulo').value = movie.titulo;
                document.getElementById('genero').value = movie.genero;
                document.getElementById('imagen').value = movie.imagen || ''; // Populate image field
                currentEditingMovieId = movie.pelicula_id;
                const movieForm = document.querySelector('#movie-form');
                movieForm.querySelector('button[type="submit"]').textContent = 'Actualizar Película';
                document.querySelector('#cancel-edit').style.display = 'inline-block';
            }
        });
    });

    moviesListContainer.querySelectorAll('.delete-movie').forEach(button => {
        button.addEventListener('click', async (event) => {
            const movieId = event.target.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
                await deletePelicula(parseInt(movieId));
                await loadMovies(moviesListContainer); // Reload movies after deletion
            }
        });
    });
}
