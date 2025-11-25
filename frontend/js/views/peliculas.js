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
                    <label for="imagen">Subir Imagen:</label>
                    <input type="file" id="imagen-upload" accept="image/*">
                    <input type="hidden" id="imagen-url"> <!-- To store the uploaded image URL -->
                    <div id="image-preview" style="margin-top: 10px; display: none;">
                        <img src="" alt="Previsualización de imagen" style="max-width: 100px; max-height: 100px; border-radius: 5px;">
                    </div>
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
        const imagenUploadInput = document.getElementById('imagen-upload');
        let imageUrl = document.getElementById('imagen-url').value; // Get existing or previously uploaded URL

        // If a new file is selected, upload it
        if (imagenUploadInput.files.length > 0) {
            const uploadedUrl = await uploadImage(imagenUploadInput.files[0]);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
                return; // Stop submission if upload fails
            }
        }

        const movieData = { titulo, genero, imagen: imageUrl };

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
        document.getElementById('imagen-url').value = ''; // Clear hidden URL
        document.getElementById('image-preview').style.display = 'none'; // Hide preview

        await loadMovies(moviesListContainer); // Reload movies after add/update
    });

    // Event listener for cancel edit button
    cancelEditButton.addEventListener('click', () => {
        movieForm.reset();
        currentEditingMovieId = null;
        movieForm.querySelector('button[type="submit"]').textContent = 'Añadir Película';
        cancelEditButton.style.display = 'none';
        document.getElementById('movie-id').value = '';
        document.getElementById('imagen-url').value = ''; // Clear hidden URL
        document.getElementById('image-preview').style.display = 'none'; // Hide preview
    });

    // Event listener for image file selection to show preview
    document.getElementById('imagen-upload').addEventListener('change', (event) => {
        const file = event.target.files[0];
        const preview = document.querySelector('#image-preview img');
        const previewContainer = document.getElementById('image-preview');

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            previewContainer.style.display = 'none';
        }
    });
}

/**
 * Helper function to upload an image file to the backend.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string|null>} The URL of the uploaded image, or null if upload fails.
 */
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error al subir la imagen: ${response.statusText}`);
        }

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('Error en la subida de imagen:', error);
        return null;
    }
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
            ${movie.imagen ? `<img src="http://localhost:3000${movie.imagen}" alt="${movie.titulo}" class="movie-image">` : ''}
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
                document.getElementById('imagen-url').value = movie.imagen || ''; // Populate hidden image URL field
                
                const previewImg = document.querySelector('#image-preview img');
                const previewContainer = document.getElementById('image-preview');
                if (movie.imagen) {
                    previewImg.src = `http://localhost:3000${movie.imagen}`; // Prepend backend URL
                    previewContainer.style.display = 'block';
                } else {
                    previewImg.src = '';
                    previewContainer.style.display = 'none';
                }

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
