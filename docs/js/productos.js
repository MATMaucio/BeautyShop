import { supabase } from './auth.js';

export const getProductos = async () => {
  const { data, error } = await supabase.from('productos').select('*');
  if (error) {
    console.error('Error obteniendo productos:', error);
  }
  return data;
};

export const getProductoById = async (id) => {
  const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
  if (error) {
    console.error('Error obteniendo el producto:', error);
  }
  return data;
};
