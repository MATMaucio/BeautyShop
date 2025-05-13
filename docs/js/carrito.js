export const addToCart = (producto) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(producto);
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem('cart')) || [];
};

export const removeFromCart = (productoId) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productoId);
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};
