const API_BASE_URL = 'http://localhost:3000/api';

export async function getPeliculas() {
    try {
        const response = await fetch(`${API_BASE_URL}/peliculas`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        return [];
    }
}

export async function getPeliculaById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/peliculas/${id}`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la película con ID ${id}:`, error);
        return null;
    }
}

export async function createPelicula(pelicula) {
    try {
        const response = await fetch(`${API_BASE_URL}/peliculas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pelicula),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear la película:', error);
        return null;
    }
}

export async function updatePelicula(id, pelicula) {
    try {
        const response = await fetch(`${API_BASE_URL}/peliculas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pelicula),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar la película con ID ${id}:`, error);
        return null;
    }
}

export async function deletePelicula(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/peliculas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return response.status === 204;
    } catch (error) {
        console.error(`Error al eliminar la película con ID ${id}:`, error);
        return false;
    }
}
