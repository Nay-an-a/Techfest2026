import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'techfest-cart';

function readCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  if (!savedCart) return [];

  const parsedCart = JSON.parse(savedCart);
  return Array.isArray(parsedCart) ? parsedCart : [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  const updateItems = updater => {
    setItems(currentItems => {
      const nextItems = updater(currentItems);
      localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    total: items.reduce((total, item) => total + item.fee * item.quantity, 0),
    addToCart: event => updateItems(currentItems => {
      const existing = currentItems.find(item => item.id === event.id);
      return existing
        ? currentItems.map(item => item.id === event.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...currentItems, { ...event, quantity: 1 }];
    }),
    removeFromCart: eventId => updateItems(currentItems => currentItems.filter(item => item.id !== eventId)),
    clearCart: () => updateItems(() => [])
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider.');
  return context;
}
