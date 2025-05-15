import { supabase } from './supabaseclient.js';

const path = window.location.pathname;
const isLoginPage = path.includes('login.html');
const isRegisterPage = path.includes('register.html');
const isIndexPage = path.includes('index.html');

if (isLoginPage) {
  const form = document.getElementById("login-form");
  const googleBtn = document.getElementById("google-login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "index.html";
  });

  googleBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/index.html`
      }
    });

    if (error) alert(error.message);
  });
}

if (isRegisterPage) {
  const form = document.getElementById("register-form");
  const googleBtn = document.getElementById("google-register");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre }
      }
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Guardar datos extra en tabla cliente
    const { error: insertError } = await supabase
      .from("cliente")
      .insert({ id: data.user.id, nombre, correo: email });

    if (insertError) {
      alert("Error al guardar el cliente: " + insertError.message);
      return;
    }

    alert("¡Cuenta creada! Revisa tu correo para confirmar.");

    window.location.href = "login.html";
  });

  googleBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/index.html`
      }
    });

    if (error) alert(error.message);
  });
}

if (isIndexPage) {
  (async () => {
    const logoutBtn = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info");

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "login.html";
      return;
    }

    userInfo.textContent = `Hola, ${user.user_metadata?.nombre || user.email}`;

    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        window.location.href = "login.html";
      }
    });

    logoutBtn.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "login.html";
    });
  })();
}


