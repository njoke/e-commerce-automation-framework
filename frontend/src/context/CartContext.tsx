import { createContext, useState, type ReactNode } from 'react';

interface CartContextType {
  itemCount: number;
  setItemCount: (count: number) => void;
}

export const CartContext = createContext<CartContextType>({
  itemCount: 0,
  setItemCount: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  return (
    <CartContext.Provider value={{ itemCount, setItemCount }}>
      {children}
    </CartContext.Provider>
  );
}
