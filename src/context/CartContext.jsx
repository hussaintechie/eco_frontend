import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(() => {
    return Number(localStorage.getItem("cartCount")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("cartCount", cartCount);
  }, [cartCount]);

  const incrementCartCount = () =>
    setCartCount((prev) => prev + 1);

  const decrementCartCount = () =>
    setCartCount((prev) => Math.max(prev - 1, 0));

  return (
    <CartContext.Provider
      value={{ cartCount, incrementCartCount, decrementCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
