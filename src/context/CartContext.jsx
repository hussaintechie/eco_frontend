import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const incrementCartCount = () =>
    setCartCount((prev) => prev + 1);

  const decrementCartCount = () =>
    setCartCount((prev) => Math.max(prev - 1, 0));

  return (
    <CartContext.Provider value={{
      cartCount,
      incrementCartCount,
      decrementCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
