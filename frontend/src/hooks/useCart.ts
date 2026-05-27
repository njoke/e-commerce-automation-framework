import { useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import type { CartItem } from '../types';

export function useCart() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = () => {
    if (!user) return;
    setLoading(true);
    getCart(user.id)
      .then((data: CartItem[]) => setCartItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addItem = async (productId: string, quantity = 1) => {
    if (!user) return;
    const data = await addToCart(user.id, productId, quantity);
    setCartItems(data);
  };

  const updateItem = async (itemId: string, quantity: number) => {
    if (!user) return;
    await updateCartItem(user.id, itemId, quantity);
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    if (!user) return;
    await removeCartItem(user.id, itemId);
    fetchCart();
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cartItems, loading, addItem, updateItem, removeItem, total, fetchCart };
}
