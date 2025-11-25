import { getPeliculas, createPelicula, updatePelicula, deletePelicula, getPeliculaById } from '../services/peliculas.js';
import { showConfirmModal } from '../main.js';

let currentEditingMovieId = null;

/**
 * Renderiza la página de gestión de películas.
 * @param {HTMLElement} container - El elemento del DOM donde se renderizará la vista.
 */
export async function renderPeliculasPage(container) {
    container.innerHTML = `
        <div class="peliculas-management">
            <h1>Gestión de Películas</h1>

            <button id="add-movie-btn" class="btn-primary">Añadir Nueva Película</button>

            <div class="modal-overlay" id="movie-form-modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <div class="form-section">
                        <h2 id="modal-title">${currentEditingMovieId ? 'Editar Película' : 'Añadir Nueva Película'}</h2>
                        <form id="movie-form">
                            <input type="hidden" id="movie-id">
                            <div class="form-group">
                                <label for="titulo">Título:</label>
                                <input type="text" id="titulo" required>
                            </div>
                            <div class="form-group">
                                <label for="genero">Género:</label>
                                <input type="text" id="genero" required>
                            </div>
                            <div class="form-group">
                                <label for="imagen">Subir Imagen:</label>
                                <input type="file" id="imagen-upload" accept="image/*">
                                <input type="hidden" id="imagen-url"> <!-- To store the uploaded image URL -->
                                <div id="image-preview" style="margin-top: 10px; display: none;">
                                    <img src="" alt="Previsualización de imagen" style="max-width: 100px; max-height: 100px; border-radius: 5px;">
                                </div>
                            </div>
                            <button type="submit" class="btn-primary" id="submit-movie-form">${currentEditingMovieId ? 'Actualizar Película' : 'Añadir Película'}</button>
                            <button type="button" id="cancel-edit" class="btn-secondary">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="list-section">
                <h2>Listado de Películas</h2>
                <div id="movies-list" class="movie-cards-container">
                    <p>Cargando películas...</p>
                </div>
            </div>
            <div id="message-container" class="message-container"></div>
        </div>
    `;

    const movieFormModal = container.querySelector('#movie-form-modal');
    const addMovieBtn = container.querySelector('#add-movie-btn');
    const closeButton = container.querySelector('.close-button');
    const movieForm = container.querySelector('#movie-form');
    const moviesListContainer = container.querySelector('#movies-list');
    const cancelEditButton = container.querySelector('#cancel-edit');
    const modalTitle = container.querySelector('#modal-title');
    const submitMovieFormBtn = container.querySelector('#submit-movie-form');
    const messageContainer = container.querySelector('#message-container');

    const showMessage = (message, type = 'success') => {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.className = 'message-container';
        }, 3000);
    };

    const openModal = () => {
        movieFormModal.style.display = 'flex';
    };

    const closeModal = () => {
        movieFormModal.style.display = 'none';
        movieForm.reset();
        currentEditingMovieId = null;
        document.getElementById('movie-id').value = '';
        document.getElementById('imagen-url').value = '';
        document.getElementById('image-preview').style.display = 'none';
        modalTitle.textContent = 'Añadir Nueva Película';
        submitMovieFormBtn.textContent = 'Añadir Película';
    };

    // Initial load of movies
    await loadMovies(moviesListContainer);

    // Event listeners for modal
    addMovieBtn.addEventListener('click', () => {
        closeModal(); // Ensure form is reset
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    cancelEditButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === movieFormModal) {
            closeModal();
        }
    });

    // Event listener for form submission
    movieForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const movieId = document.getElementById('movie-id').value;
        const titulo = document.getElementById('titulo').value;
        const genero = document.getElementById('genero').value;
        const imagenUploadInput = document.getElementById('imagen-upload');
        let imageUrl = document.getElementById('imagen-url').value;

        if (imagenUploadInput.files.length > 0) {
            const uploadedUrl = await uploadImage(imagenUploadInput.files[0]);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                showMessage('Error al subir la imagen. Por favor, inténtalo de nuevo.', 'error');
                return;
            }
        }

        const movieData = { titulo, genero, imagen: imageUrl };

        if (movieId) {
            const updated = await updatePelicula(parseInt(movieId), movieData);
            if (updated) {
                showMessage('Película actualizada exitosamente.', 'success');
            } else {
                showMessage('Error al actualizar la película.', 'error');
            }
        }

        closeModal();
        await loadMovies(moviesListContainer);
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
        }

        else {
            preview.src = '';
            previewContainer.style.display = 'none';
        }
    });

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
                    <button class="edit-movie btn-edit" data-id="${movie.pelicula_id}">Editar</button>
                    <button class="delete-movie btn-delete" data-id="${movie.pelicula_id}">Eliminar</button>
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
                    document.getElementById('imagen-url').value = movie.imagen || '';
                    
                    const previewImg = document.querySelector('#image-preview img');
                    const previewContainer = document.getElementById('image-preview');
                    if (movie.imagen) {
                        previewImg.src = `http://localhost:3000${movie.imagen}`;
                        previewContainer.style.display = 'block';
                    } else {
                        previewImg.src = '';
                        previewContainer.style.display = 'none';
                    }

                    currentEditingMovieId = movie.pelicula_id;
                    modalTitle.textContent = 'Editar Película';
                    submitMovieFormBtn.textContent = 'Actualizar Película';
                    openModal();
                }
            });
        });

        moviesListContainer.querySelectorAll('.delete-movie').forEach(button => {
            button.addEventListener('click', async (event) => {
                const movieId = event.target.dataset.id;
                showConfirmModal('¿Estás seguro de que quieres eliminar esta película?', async () => {
                    await deletePelicula(parseInt(movieId));
                    showMessage('Película eliminada exitosamente.', 'success');
                    await loadMovies(moviesListContainer);
                });
            });
        });
    }
}
