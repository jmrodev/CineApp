import { renderPeliculasPage } from './views/peliculas.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('app'); // El contenedor principal en index.html
    if (mainContainer) {
        renderPeliculasPage(mainContainer);
    } else {
        console.error('El contenedor principal con id "app" no fue encontrado.');
    }
});