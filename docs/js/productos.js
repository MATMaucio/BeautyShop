import { supabase } from "./auth.js";

// Función para cargar productos desde la base de datos de Supabase
async function cargarProductos() {
  const { data, error } = await supabase.from("producto").select("*");
  
  if (error) {
    console.error("❌ Error al cargar productos:", error.message);
    return;
  }

  const productosContainer = document.getElementById("productos-container");

  data.forEach(producto => {
    const productoElement = document.createElement("div");
    productoElement.classList.add("producto");

    productoElement.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p>Precio: $${producto.precio}</p>
      <button class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
    `;

    productosContainer.appendChild(productoElement);
  });
}

// Exportar la función para cargar productos
export { cargarProductos };
