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
        redirectTo: `${location.origin}/index.html`
      }
    });

    if (error) alert(error.message);
  });
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
        redirectTo: `${location.origin}/index.html`
      }
    });

    if (error) alert(error.message);
  });
}

// 🟡 PRODUCTOS (página privada)
if (isProductosPage) {
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

// 🟢 INDEX (público con sesión opcional)
if (isIndexPage) {
  (async () => {
    const logoutBtn = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info");

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      userInfo.textContent = `Hola, ${user.user_metadata?.nombre || user.email}`;
      logoutBtn.style.display = "inline-block";

      logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "index.html";
      });
    } else {
      userInfo.textContent = "No has iniciado sesión";
      logoutBtn.style.display = "none";
    }
  })();
}

// 🟣 CHECKOUT (página privada protegida)
if (isCheckoutPage) {
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

// 🟠 CARRITO (página privada protegida)
if (isCarritoPage) {
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

// 🔴 HISTORIAL (página privada protegida)
if (isHistorialPage) {
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

// 🟤 PERFIL (página privada protegida)
if (isPerfilPage) {
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



