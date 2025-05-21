import { supabase } from './supabaseclient.js';

const resumenDiv = document.getElementById("resumen-pedido");

(async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    resumenDiv.innerHTML = "<p>No se pudo cargar tu pedido. Inicia sesión nuevamente.</p>";
    return;
  }

  // Obtener el último pedido del usuario
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedido")
    .select("*")
    .eq("id_cliente", user.id)
    .order("fecha", { ascending: false })
    .limit(1)
    .single();

  if (pedidoError || !pedido) {
    resumenDiv.innerHTML = "<p>No se encontró ningún pedido reciente.</p>";
    return;
  }

  // Obtener detalles del pedido
  const { data: detalles, error: detalleError } = await supabase
    .from("detalle_pedido")
    .select("cantidad, subtotal, producto(nombre)")
    .eq("id_pedido", pedido.id);

  // Obtener método de pago
  const { data: metodoPago } = await supabase
    .from("metodo_pago")
    .select("tipo")
    .eq("id_pedido", pedido.id)
    .single();

  if (detalleError || !detalles) {
    resumenDiv.innerHTML = "<p>No se pudieron obtener los detalles del pedido.</p>";
    return;
  }

  const productosHTML = detalles.map(d => `
    <li>
      ${d.producto.nombre} - Cantidad: ${d.cantidad} - Subtotal: $${d.subtotal.toFixed(2)}
    </li>
  `).join("");

  resumenDiv.innerHTML = `
    <h2>Resumen del pedido</h2>
    <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}</p>
    <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
    <p><strong>Método de pago:</strong> ${metodoPago?.tipo || "Desconocido"}</p>
    <h3>Productos:</h3>
    <ul>${productosHTML}</ul>
  `;
})();
