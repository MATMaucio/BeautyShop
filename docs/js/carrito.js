// Obtener elementos HTML
const carritoItems = document.getElementById("carrito-items");
const carritoTotal = document.getElementById("carrito-total");
const checkoutBtn = document.getElementById("checkout-btn"); // botón para ir a checkout

// Cargar carrito desde localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Calcular total
function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + (item.precio ?? 0) * (item.cantidad ?? 0), 0);
}

// Mostrar carrito en pantalla
function mostrarCarrito() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    carritoItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    carritoTotal.textContent = "Total: $0.00";

    if (checkoutBtn) checkoutBtn.style.display = "none"; // ocultar botón si carrito vacío
    return;
  }

  carritoItems.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <h3>${item.nombre}</h3>
      <p>Cantidad: ${item.cantidad}</p>
      <p>Precio unitario: $${(item.precio ?? 0).toFixed(2)}</p>
      <button data-id="${item.id}" class="eliminar-btn">Eliminar</button>
    </div>
  `).join("");

  const total = calcularTotal(carrito);
  carritoTotal.textContent = `Total: $${total.toFixed(2)}`;

  if (checkoutBtn) checkoutBtn.style.display = "inline-block"; // mostrar botón si hay productos
}

// Manejar eliminación
carritoItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar-btn")) {
    const id = e.target.getAttribute("data-id");
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id.toString() !== id.toString());
    guardarCarrito(carrito);
    mostrarCarrito();

    // Lanzar evento para actualizar contador en otros scripts
    const eventActualizar = new Event('carritoActualizado');
    window.dispatchEvent(eventActualizar);
  }
});

// Inicializar
mostrarCarrito();

// Opcional: Manejar clic en botón checkout para ir a checkout.html
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}



