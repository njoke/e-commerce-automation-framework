import type { CheckoutPayload } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const login = (username: string, password: string) =>
  fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(r => r.json());

export const getProducts = (params?: { search?: string; category?: string; sort?: string }) => {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.sort) query.set('sort', params.sort);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetch(`${BASE_URL}/api/products${qs}`).then(r => r.json());
};

export const getProductById = (id: string) =>
  fetch(`${BASE_URL}/api/products/${id}`).then(r => r.json());

export const getCart = (userId: string) =>
  fetch(`${BASE_URL}/api/cart`, {
    headers: { 'x-user-id': userId },
  }).then(r => r.json());

export const addToCart = (userId: string, productId: string, quantity: number) =>
  fetch(`${BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify({ productId, quantity }),
  }).then(r => r.json());

export const updateCartItem = (userId: string, itemId: string, quantity: number) =>
  fetch(`${BASE_URL}/api/cart/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify({ quantity }),
  }).then(r => r.json());

export const removeCartItem = (userId: string, itemId: string) =>
  fetch(`${BASE_URL}/api/cart/${itemId}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  }).then(r => r.json());

export const checkout = (userId: string, payload: CheckoutPayload) =>
  fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export const getOrders = (userId: string) =>
  fetch(`${BASE_URL}/api/orders`, {
    headers: { 'x-user-id': userId },
  }).then(r => r.json());
