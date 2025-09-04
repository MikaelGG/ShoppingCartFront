import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializar carrito desde localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopping-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem("shopping-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) return;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.code === product.code);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Cambiar cantidad
  const updateQuantity = (code, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.code === code
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  // Eliminar producto
  const removeFromCart = (code) => {
    setCart((prev) => prev.filter((item) => item.code !== code));
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems: cart.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
