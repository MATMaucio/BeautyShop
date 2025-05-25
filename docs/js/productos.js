import { supabase } from './supabaseclient.js';

// Contenedores del DOM
const productList = document.getElementById("product-list");
const carritoCount = document.getElementById("carrito-count");

// Obtener carrito desde localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// Actualizar contador visual del carrito en header
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  carritoCount.textContent = totalCantidad;
}

// Cargar productos desde Supabase y mostrarlos
async function cargarProductos() {
  const { data: productos, error } = await supabase
    .from("producto")
    .select("id, nombre, precio, stock, imagen_url");

  if (error) {
    productList.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
    return;
  }

  if (productos.length === 0) {
    productList.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  productList.innerHTML = productos.map(prod => `
    <article class="product-card">
      <div class="product-image-container">
        <img src="${prod.imagen_url}" alt="Imagen de ${prod.nombre}" />
      </div>
      <h3>${prod.nombre}</h3>
      <p><strong>Precio:</strong> $${prod.precio.toFixed(2)}</p>
      <p><strong>Stock disponible:</strong> ${prod.stock}</p>
      <button class="agregar-carrito" data-id="${prod.id}">Agregar al carrito</button>
    </article>
  `).join("");
}

// Agregar producto al carrito con validación de stock
async function agregarAlCarritoConStock(productoId) {
  const { data: producto, error } = await supabase
    .from("producto")
    .select("id, nombre, precio, stock, imagen_url")
    .eq("id", productoId)
    .single();

  if (error || !producto) {
    alert("Error al obtener el producto.");
    return;
  }

  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === productoId);
  const cantidadDeseada = (existente?.cantidad ?? 0) + 1;

  if (cantidadDeseada > producto.stock) {
    alert("No hay suficiente stock disponible.");
    return;
  }

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen_url: producto.imagen_url
    });
  }

  guardarCarrito(carrito);
  alert("Producto agregado al carrito.");
}

// Escuchar clicks para agregar productos al carrito
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("agregar-carrito")) {
    const id = e.target.dataset.id;
    agregarAlCarritoConStock(id);
  }
});

// Inicialización
cargarProductos();
actualizarContadorCarrito();
