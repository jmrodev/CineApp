const API_BASE_URL = 'http://localhost:3000/api';

export async function getClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return [];
    }
}

export async function getClienteById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener el cliente con ID ${id}:`, error);
        return null;
    }
}

export async function createCliente(cliente) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        return null;
    }
}

export async function updateCliente(id, cliente) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar el cliente con ID ${id}:`, error);
        return null;
    }
}

export async function deleteCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return response.status === 204; // No hay contenido que devolver
    } catch (error) {
        console.error(`Error al eliminar el cliente con ID ${id}:`, error);
        return false;
    }
}
