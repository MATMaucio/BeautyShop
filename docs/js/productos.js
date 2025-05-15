// js/productos.js
import { supabase } from './supabaseclient.js';

const productosContainer = document.getElementById("product-list"); // Asegúrate que el ID coincide en tu HTML

async function cargarProductos() {
  const { data: productos, error } = await supabase.from("producto").select("*");

  if (error) {
    productosContainer.innerHTML = `<p class="error">Error al cargar productos: ${error.message}</p>`;
    return;
  }

  if (!productos || productos.length === 0) {
    productosContainer.innerHTML = `<p>No hay productos disponibles.</p>`;
    return;
  }

  productosContainer.innerHTML = productos.map(producto => `
    <article class="product-card">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Marca:</strong> ${producto.marca}</p>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
    </article>
  `).join("");
}

cargarProductos();

