import { supabase } from './auth.js';

export const createPedido = async (pedido) => {
  const { data, error } = await supabase.from('pedidos').insert([pedido]);
  if (error) {
    console.error('Error creando el pedido:', error);
    throw error;
  }
  return data;
};

export const getPedidos = async (userId) => {
  const { data, error } = await supabase.from('pedidos').select('*').eq('user_id', userId);
  if (error) {
    console.error('Error obteniendo los pedidos:', error);
    throw error;
  }
  return data;
};
