import { supabase } from './supabaseclient.js';

// Elementos del DOM
const carritoItems = document.getElementById("checkout-items");
const totalElement = document.getElementById("checkout-total");
const finalizarBtn = document.getElementById("finalizar-compra");

// 🔁 URL de tu Stripe Payment Link
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_28E28qcejfCDcBMd2l7Vm01"; // Reemplaza con tu enlace real

// Obtener carrito
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Mostrar resumen del carrito
function mostrarResumen() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    carritoItems.innerHTML = "<p>No hay productos en el carrito.</p>";
    totalElement.textContent = "Total: $0.00";
    finalizarBtn.disabled = true;
    return;
  }

  carritoItems.innerHTML = carrito.map(item => `
    <div class="checkout-item">
      <h4>${item.nombre}</h4>
      <p>Cantidad: ${item.cantidad}</p>
      <p>Precio unitario: $${item.precio.toFixed(2)}</p>
    </div>
  `).join("");

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Finalizar compra
finalizarBtn.addEventListener("click", async () => {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;

  // Obtener usuario
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert("Debes estar logueado para completar la compra.");
    return;
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const fecha = new Date().toISOString();

  // ✅ Validar stock antes de crear el pedido
  for (const item of carrito) {
    const { data: productoActual, error: fetchError } = await supabase
      .from("producto")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (fetchError || !productoActual) {
      alert(`Error al verificar stock del producto: ${item.nombre}`);
      return;
    }

    if (productoActual.stock < item.cantidad) {
      alert(`No hay suficiente stock para el producto: ${item.nombre}. Solo quedan ${productoActual.stock}.`);
      return;
    }
  }

  // Crear pedido
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedido")
    .insert([{ fecha, total, id_cliente: user.id }])
    .select()
    .single();

  if (pedidoError) {
    console.error("Error al crear pedido:", pedidoError.message);
    alert("No se pudo completar la compra.");
    return;
  }

  // Crear detalle_pedido
  const detalles = carrito.map(item => ({
    id_pedido: pedido.id,
    id_producto: item.id,
    cantidad: item.cantidad,
    subtotal: item.precio * item.cantidad
  }));

  const { error: detalleError } = await supabase
    .from("detalle_pedido")
    .insert(detalles);

  if (detalleError) {
    console.error("Error al guardar detalle:", detalleError.message);
    alert("No se pudieron guardar los productos del pedido.");
    return;
  }

  // ✅ Descontar stock
  for (const item of carrito) {
    const { data: productoActual, error: fetchError } = await supabase
      .from("producto")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (fetchError || !productoActual) {
      console.error(`Error al obtener stock de producto ID ${item.id}:`, fetchError?.message);
      alert("Hubo un error al actualizar el stock.");
      return;
    }

    const nuevoStock = productoActual.stock - item.cantidad;

    const { error: updateError } = await supabase
      .from("producto")
      .update({ stock: nuevoStock })
      .eq("id", item.id);

    if (updateError) {
      console.error(`Error al actualizar stock de producto ID ${item.id}:`, updateError.message);
      alert("No se pudo actualizar el inventario.");
      return;
    }
  }

  // Registrar método de pago
  const { error: metodoPagoError } = await supabase
    .from("metodo_pago")
    .insert([{
      id_pedido: pedido.id,
      tipo: "stripe_payment_link"
    }]);

  if (metodoPagoError) {
    alert("Error al registrar método de pago.");
    return;
  }

  // Limpiar carrito y redirigir a Stripe
  localStorage.removeItem("carrito");
  window.location.href = STRIPE_PAYMENT_LINK;
});

// Inicializar
mostrarResumen();

