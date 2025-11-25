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
        return []; // Devolver un array vacío en caso de error
    }
}
