const API_BASE_URL = 'http://localhost:3000/api';

export async function getSalas() {
    try {
        const response = await fetch(`${API_BASE_URL}/salas`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las salas:', error);
        return [];
    }
}

export async function getSalaById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/salas/${id}`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la sala con ID ${id}:`, error);
        return null;
    }
}

export async function createSala(sala) {
    try {
        const response = await fetch(`${API_BASE_URL}/salas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sala),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear la sala:', error);
        return null;
    }
}

export async function updateSala(id, sala) {
    try {
        const response = await fetch(`${API_BASE_URL}/salas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sala),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar la sala con ID ${id}:`, error);
        return null;
    }
}

export async function deleteSala(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/salas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return response.status === 204;
    } catch (error) {
        console.error(`Error al eliminar la sala con ID ${id}:`, error);
        return false;
    }
}
