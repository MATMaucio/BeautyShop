import { supabase } from './supabaseclient.js';

const path = window.location.pathname;
const isLoginPage = path.includes('login.html');
const isRegisterPage = path.includes('register.html');
const isIndexPage = path.includes('index.html');
const isProductosPage = path.includes('productos.html');
const isCheckoutPage = path.includes('checkout.html');
const isCarritoPage = path.includes('carrito.html');
const isHistorialPage = path.includes('historial.html'); // 🆕
const isPerfilPage = path.includes('perfil.html'); // 🆕
const isRecuperarPage = path.includes('recuperar.html'); // 🆕

// Función para asegurar que cliente exista en tabla "cliente"
async function asegurarClienteRegistrado(user) {
  if (!user) return;

  const { data: existingUser, error: checkError } = await supabase
    .from("cliente")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingUser && !checkError) {
    const nombre = user.user_metadata?.nombre || user.user_metadata?.full_name || user.email;
    const correo = user.email;

    const { error: insertError } = await supabase
      .from("cliente")
      .insert({ id: user.id, nombre, correo });

    if (insertError) {
      console.error("❌ Error al insertar cliente:", insertError.message);
    } else {
      console.log("✅ Cliente insertado en Supabase por primera vez.");

      if (user.app_metadata?.provider === "google") {
        alert(`¡Bienvenido, ${nombre}! Tu cuenta ha sido creada correctamente con Google.`);
      }
    }
  } else {
    console.log("🟡 Cliente ya existe en Supabase.");
  }
}

// 🟢 LOGIN
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
        redirectTo: `${location.origin}/docs/index.html`
      }
    });

    if (error) alert(error.message);
  });

  // Detectar sesión al regresar del OAuth
  (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await asegurarClienteRegistrado(user);
  })();
}

// 🔵 REGISTRO
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
        redirectTo: `${location.origin}/docs/index.html`
      }
    });

    if (error) alert(error.message);
  });

  // Detectar sesión al regresar del OAuth
  (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await asegurarClienteRegistrado(user);
  })();
}

// 🟣 RECUPERAR CONTRASEÑA
if (isRecuperarPage) {
  const form = document.getElementById("recuperar-form");
  const emailInput = document.getElementById("recuperar-email");
  const mensaje = document.getElementById("mensaje-recuperacion");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/docs/reset.html`
    });

    if (error) {
      mensaje.textContent = "❌ " + error.message;
      mensaje.style.color = "red";
    } else {
      mensaje.textContent = "✅ Revisa tu correo para restablecer tu contraseña.";
      mensaje.style.color = "green";
    }
  });
}

// Función común para cargar usuario y proteger páginas privadas
async function cargarUsuarioYProteger(paginaPrivada = false) {
  const logoutBtn = document.getElementById("logout-btn");
  const userInfo = document.getElementById("user-info");

  const { data: { user }, error } = await supabase.auth.getUser();

  if (paginaPrivada && (error || !user)) {
    window.location.href = "login.html";
    return;
  }

  if (user) {
    userInfo.textContent = `Hola, ${user.user_metadata?.nombre || user.email}`;
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
      });
    }
  } else {
    if (userInfo) userInfo.textContent = "No has iniciado sesión";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (!session && paginaPrivada) {
      window.location.href = "login.html";
    }
  });
}

// Páginas privadas protegidas:
if (isProductosPage) cargarUsuarioYProteger(true);
if (isCheckoutPage) cargarUsuarioYProteger(true);
if (isCarritoPage) cargarUsuarioYProteger(true);
if (isHistorialPage) cargarUsuarioYProteger(true);
if (isPerfilPage) cargarUsuarioYProteger(true);

// Página pública con sesión opcional:
if (isIndexPage) cargarUsuarioYProteger(false);