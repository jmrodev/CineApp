const API_BASE_URL = 'http://localhost:3000/api';

export async function getFunciones(filters = {}) {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const url = `${API_BASE_URL}/funciones${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las funciones:', error);
        return [];
    }
}

export async function getFuncionById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/funciones/${id}`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la función con ID ${id}:`, error);
        return null;
    }
}

export async function createFuncion(funcion) {
    try {
        const response = await fetch(`${API_BASE_URL}/funciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcion),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear la función:', error);
        return null;
    }
}

export async function updateFuncion(id, funcion) {
    try {
        const response = await fetch(`${API_BASE_URL}/funciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcion),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar la función con ID ${id}:`, error);
        return null;
    }
}

export async function deleteFuncion(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/funciones/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json(); // Attempt to parse error message from backend
            console.log('Error data from backend:', errorData); // Added logging
            throw new Error(errorData.message || `Error en la red: ${response.statusText}`);
        }
        return response.status === 204;
    } catch (error) {
        console.error(`Error al eliminar la función con ID ${id}:`, error);
        // Re-throw the error so the calling component can catch it and display the message
        throw error;
    }
}
