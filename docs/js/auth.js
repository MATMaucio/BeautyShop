// js/auth.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Credenciales del proyecto actual
const SUPABASE_URL = "https://ksppnkopnkpmlcethoma.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHBua29wbmtwbWxjZXRob21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzU1NzAsImV4cCI6MjA2Mjc1MTU3MH0.GpfcrsPoz1c0wZV4Zahk_yD0OOQ86PN7494v8vlBIHE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Detecta cambios de sesión (login/logout)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    const user = session.user;
    const correo = user.email;
    const nombre =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Sin nombre";

    if (!correo || !user.id) {
      console.warn("❗ Sesión iniciada pero faltan datos del usuario.");
      return;
    }

    // Inserta o actualiza el cliente en la base de datos
    const { error } = await supabase
      .from("cliente")
      .upsert({
        id: user.id,
        correo,
        nombre
      }, { onConflict: 'id' });

    if (error) {
      console.error("❌ Error al actualizar cliente:", error.message);
    } else {
      console.log("✅ Cliente sincronizado:", correo);
    }
  } else if (event === "SIGNED_OUT") {
    console.log("👋 Usuario cerró sesión.");
  }
});