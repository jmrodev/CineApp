import { renderPeliculasPage } from './views/peliculas.js';
import { renderSalasPage } from './views/salas.js';
import { renderFuncionesPage } from './views/funciones.js';
import { renderReservasPage } from './views/reservas.js';

const routes = {
    '#peliculas': renderPeliculasPage,
    '#salas': renderSalasPage,
    '#funciones': renderFuncionesPage,
    '#reservas': renderReservasPage,
    '': renderPeliculasPage // Default route
};

function router() {
    const mainContentContainer = document.getElementById('app');
    if (!mainContentContainer) {
        console.error('El contenedor principal con id "app" no fue encontrado.');
        return;
    }

    const path = window.location.hash;
    const renderFunction = routes[path] || routes['']; // Get function or default

    // Clear previous content and render new page
    mainContentContainer.innerHTML = ''; // Clear existing content
    const pageContainer = document.createElement('div');
    pageContainer.id = path.substring(1) + '-container' || 'peliculas-container'; // Dynamic ID for specific page content
    mainContentContainer.appendChild(pageContainer);
    
    renderFunction(pageContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial route handling
    router();
    // Handle route changes
    window.addEventListener('hashchange', router);
});
