const API_BASE_URL = 'http://localhost:3000/api';

export async function getReservas() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return [];
    }
}

export async function getReservaById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${id}`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la reserva con ID ${id}:`, error);
        return null;
    }
}

export async function createReserva(reserva) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reserva),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return null;
    }
}

export async function updateReserva(id, reserva) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reserva),
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar la reserva con ID ${id}:`, error);
        return null;
    }
}

export async function deleteReserva(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }
        return response.status === 204;
    } catch (error) {
        console.error(`Error al eliminar la reserva con ID ${id}:`, error);
        return false;
    }
}
