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
    .select("id, nombre, precio, stock");

  if (error) {
    productList.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
    return;
  }

  if (productos.length === 0) {
    productList.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  // Crear HTML para cada producto
  productList.innerHTML = productos.map(prod => `
    <div class="producto">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <p>Stock disponible: ${prod.stock}</p>
      <button class="agregar-btn" data-id="${prod.id}">Agregar al carrito</button>
    </div>
  `).join("");
}

// Agregar producto al carrito con validación de stock
async function agregarAlCarritoConStock(productoId) {
  // Obtener producto con stock actualizado desde Supabase
  const { data: producto, error } = await supabase
    .from("producto")
    .select("id, nombre, precio, stock")
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
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  alert("Producto agregado al carrito.");
}

// Escuchar clicks para agregar productos al carrito
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("agregar-btn")) {
    const id = e.target.dataset.id; // <-- Aquí ya sin parseInt
    agregarAlCarritoConStock(id);
  }
});

// Inicialización
cargarProductos();
actualizarContadorCarrito();



