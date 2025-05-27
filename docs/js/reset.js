import { supabase } from './supabaseclient.js';

const form = document.getElementById('reset-form');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newPassword !== confirmPassword) {
    mensaje.textContent = '❌ Las contraseñas no coinciden.';
    mensaje.style.color = 'red';
    return;
  }

  if (newPassword.length < 6) {
    mensaje.textContent = '❌ La contraseña debe tener al menos 6 caracteres.';
    mensaje.style.color = 'red';
    return;
  }

  // Obtener token de la URL
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get('access_token');


  if (!accessToken) {
    mensaje.textContent = '❌ Token inválido o expirado.';
    mensaje.style.color = 'red';
    return;
  }

  // Actualizar contraseña con Supabase
  const { data, error } = await supabase.auth.updateUser(
    { password: newPassword },
    { accessToken } // Pasar token para autorizar el cambio
  );

  if (error) {
    mensaje.textContent = '❌ Error al cambiar la contraseña: ' + error.message;
    mensaje.style.color = 'red';
  } else {
    mensaje.textContent = '✅ Contraseña actualizada correctamente. Redirigiendo al login...';
    mensaje.style.color = 'green';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 3000);
  }
});
