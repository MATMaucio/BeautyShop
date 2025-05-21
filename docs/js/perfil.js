import { supabase } from './supabaseclient.js';

const form = document.getElementById('perfil-form');
const nombreInput = document.getElementById('nombre');
const correoInput = document.getElementById('correo');
const direccionInput = document.getElementById('direccion');
const telefonoInput = document.getElementById('telefono');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const btnHistorial = document.getElementById('btn-historial');

let currentUserId = null;

(async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    alert("No has iniciado sesión.");
    window.location.href = "login.html";
    return;
  }

  currentUserId = user.id;
  correoInput.value = user.email;
  userInfo.textContent = `Hola, ${user.user_metadata?.nombre || user.email}`;
  logoutBtn.style.display = 'inline-block';

  // Consultamos datos actuales del cliente
  const { data: cliente, error: clienteError } = await supabase
    .from("cliente")
    .select("*")
    .eq("id", currentUserId)
    .single();

  if (cliente && !clienteError) {
    nombreInput.value = cliente.nombre || '';
    direccionInput.value = cliente.direccion || '';
    telefonoInput.value = cliente.telefono || '';
  } else {
    // En caso de que no exista aún el cliente (solo si no se insertó en el registro)
    nombreInput.value = user.user_metadata?.nombre || '';
  }
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();
  const correo = correoInput.value.trim();
  const direccion = direccionInput.value.trim();
  const telefono = telefonoInput.value.trim();

  // Verificar si el cliente ya existe
  const { data: clienteExistente } = await supabase
    .from("cliente")
    .select("id")
    .eq("id", currentUserId)
    .single();

  let response;

  if (clienteExistente) {
    // UPDATE
    response = await supabase
      .from("cliente")
      .update({ nombre, correo, direccion, telefono })
      .eq("id", currentUserId);
  } else {
    // INSERT
    response = await supabase
      .from("cliente")
      .insert([{ id: currentUserId, nombre, correo, direccion, telefono }]);
  }

  if (response.error) {
    alert("Error al guardar: " + response.error.message);
  } else {
    alert("Perfil actualizado correctamente.");
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
});

// Botón para ir al historial
btnHistorial.addEventListener('click', () => {
  window.location.href = 'historial.html';
});

