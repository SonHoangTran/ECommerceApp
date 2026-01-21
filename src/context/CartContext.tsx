import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface CartContextType {
  // TODO: Define cart context type
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // TODO: Implement cart context provider
  return (
    <CartContext.Provider value={{}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};
