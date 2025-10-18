import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Hook personalizado que maneja la navegación automáticamente
export const useAddToCart = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (producto) => {
    const success = addItem(producto, () => {
      console.log('useAddToCart: Redirigiendo a login');
      navigate('/login');
    });

    if (success) {
      console.log('useAddToCart: Producto añadido exitosamente');
    }

    return success;
  };
  

  return handleAddToCart;
};


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isLoggedIn } = useSession();

  const addItem = (producto, onNotLoggedIn) => {
    // Verificar si el usuario está logueado
    if (!isLoggedIn()) {
      console.log('CartContext: Usuario no logueado');
      if (onNotLoggedIn) {
        onNotLoggedIn(); // Ejecutar callback para redirigir
      }
      return false; // Retorna false si no pudo añadir
    }

    console.log(
      'CartContext: Usuario logueado, añadiendo producto:',
      producto.titulo
    );
    setCartItems((prevItems) => {
      // Verificar si el producto ya existe en el carrito
      const existingItem = prevItems.find(
        (item) => item.producto.id === producto.id
      );

      if (existingItem) {
        // Si existe, incrementar la cantidad
        return prevItems.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [
          ...prevItems,
          {
            producto: producto,
            cantidad: 1,
            precioUnitario: producto.precio,
          },
        ];
      }
    });
    return true; // Retorna true si se añadió exitosamente
  };

  const removeItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.producto.id !== id)
    );
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.producto.id === id ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
