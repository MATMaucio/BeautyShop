import { getCart, addToCart, removeFromCart, clearCart } from './carrito.js';
import { getProductos, getProductoById } from './productos.js';

export const displayCart = () => {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-container');
  cartContainer.innerHTML = ''; // Limpiar carrito

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
  } else {
    cart.forEach(producto => {
      const productoElement = document.createElement('div');
      productoElement.classList.add('cart-item');
      productoElement.innerHTML = `
        <h4>${producto.nombre}</h4>
        <p>$${producto.precio}</p>
        <button class="remove-item" data-id="${producto.id}">Eliminar</button>
      `;
      cartContainer.appendChild(productoElement);
    });
    
    // Manejo de eliminar producto del carrito
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const productoId = e.target.getAttribute('data-id');
        removeFromCart(productoId);
        displayCart();
      });
    });
  }
};
