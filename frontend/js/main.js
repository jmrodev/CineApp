document.addEventListener('DOMContentLoaded', () => {
    const moviesContainer = document.getElementById('movies-container');

    fetch('http://localhost:3000/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            moviesContainer.innerHTML = ''; // Clear previous content
            movies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');

                movieCard.innerHTML = `
                    <h2>${movie.title}</h2>
                    <p><strong>Género:</strong> ${movie.genre}</p>
                    <p><strong>Horario:</strong> ${movie.schedule}</p>
                    <p><strong>Sala:</strong> ${movie.room}</p>
                    <p><strong>Asientos disponibles:</strong> ${movie.available_seats}</p>
                `;

                moviesContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            moviesContainer.innerHTML = '<p>Error al cargar las películas. Asegúrate de que el servidor backend esté funcionando.</p>';
        });
});
