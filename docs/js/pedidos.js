// js/busqueda.js

const searchInput = document.getElementById('search-input');

if (window.location.pathname.endsWith('productos.html') && searchInput) {
  searchInput.addEventListener('input', () => {
    const texto = searchInput.value.trim().toLowerCase();
    const productos = document.querySelectorAll('#product-list .product-card');

    productos.forEach(card => {
      const nombre = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = nombre.includes(texto) ? 'block' : 'none';
    });
  });
}
