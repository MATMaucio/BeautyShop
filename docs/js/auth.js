import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Configuración de Supabase
const SUPABASE_URL = "https://ksppnkopnkpmlcethoma.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHBua29wbmtwbWxjZXRob21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzU1NzAsImV4cCI6MjA2Mjc1MTU3MH0.GpfcrsPoz1c0wZV4Zahk_yD0OOQ86PN7494v8vlBIHE";

// ✅ Cliente Supabase listo para usar en toda la app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Manejo de eventos de sesión (login/logout)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    const user = session.user;
    const correo = user.email;
    const nombre =
      user.user_metadata?.full_name ||  // Google
      user.user_metadata?.name ||       // fallback
      "Sin nombre";

    if (!correo || !user.id) {
      console.warn("❗ Sesión iniciada pero faltan datos del usuario.");
      return;
    }

    // Inserta o actualiza en la tabla 'cliente'
    const { error } = await supabase
      .from("cliente")
      .upsert({
        id: user.id,
        correo,
        nombre
      }, { onConflict: 'id' }); // evita duplicados por ID

    if (error) {
      console.error("❌ Error al sincronizar cliente:", error.message);
    } else {
      console.log("✅ Cliente sincronizado:", correo);
    }
  }

  if (event === "SIGNED_OUT") {
    console.log("👋 Sesión cerrada.");
  }
});
