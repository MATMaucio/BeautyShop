import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Configuración de Supabase
const SUPABASE_URL = "https://ksppnkopnkpmlcethoma.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHBua29wbmtwbWxjZXRob21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzU1NzAsImV4cCI6MjA2Mjc1MTU3MH0.GpfcrsPoz1c0wZV4Zahk_yD0OOQ86PN7494v8vlBIHE";  // Reemplaza esto por tu clave anónima

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signUp = async (email, password, name) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  if (error) {
    throw error;
  }
  return user;
};

export const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    throw error;
  }
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getUser = async () => {
  const user = supabase.auth.user();
  return user;
};

export default supabase;
