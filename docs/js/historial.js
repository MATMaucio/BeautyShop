import { supabase } from './supabaseclient.js';

const contenedor = document.getElementById("historial-container");

async function cargarHistorial() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    contenedor.innerHTML = "<p>Debes estar logueado para ver tu historial.</p>";
    return;
  }

  // Obtener los pedidos del usuario
  const { data: pedidos, error } = await supabase
    .from("pedido")
    .select("id, fecha, total")
    .eq("id_cliente", user.id)
    .order("fecha", { ascending: false });

  if (error || pedidos.length === 0) {
    contenedor.innerHTML = "<p>No tienes pedidos registrados.</p>";
    return;
  }

  // Obtener detalles por cada pedido
  const historialHTML = await Promise.all(pedidos.map(async pedido => {
    const { data: detalles, error: detalleError } = await supabase
      .from("detalle_pedido")
      .select("cantidad, subtotal, producto (nombre, precio)")
      .eq("id_pedido", pedido.id);

    if (detalleError) return `<p>Error al cargar detalles del pedido ${pedido.id}</p>`;

    const itemsHTML = detalles.map(detalle => `
      <li>${detalle.producto.nombre} - ${detalle.cantidad} × $${detalle.producto.precio.toFixed(2)} = $${detalle.subtotal.toFixed(2)}</li>
    `).join("");

    return `
      <div class="pedido">
        <h3>Pedido #${pedido.id}</h3>
        <p>Fecha: ${new Date(pedido.fecha).toLocaleString()}</p>
        <p>Total: $${pedido.total.toFixed(2)}</p>
        <ul>${itemsHTML}</ul>
      </div>
    `;
  }));

  contenedor.innerHTML = historialHTML.join("");
}

cargarHistorial();
