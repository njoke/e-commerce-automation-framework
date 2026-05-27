const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

// In-memory cart store: { [userId]: CartItem[] }
const carts = {};

const getCart = (req, res) => {
  const userId = req.headers['x-user-id'];
  const cart = carts[userId] || [];
  res.status(200).json(cart);
};

const addToCart = (req, res) => {
  const userId = req.headers['x-user-id'];
  const { productId, quantity } = req.body;

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found', code: 'PRODUCT_NOT_FOUND' });
  }

  if (!carts[userId]) carts[userId] = [];

  const existing = carts[userId].find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    carts[userId].push({
      itemId: `${userId}-${productId}`,
      productId,
      name: product.name,
      price: product.price,
      quantity
    });
  }

  res.status(201).json(carts[userId]);
};

const updateCartItem = (req, res) => {
  const userId = req.headers['x-user-id'];
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity', code: 'INVALID_QUANTITY' });
  }

  const cart = carts[userId] || [];
  const item = cart.find(i => i.itemId === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Cart item not found', code: 'ITEM_NOT_FOUND' });
  }

  item.quantity = quantity;
  res.status(200).json(item);
};

const removeCartItem = (req, res) => {
  const userId = req.headers['x-user-id'];
  const { itemId } = req.params;

  const cart = carts[userId] || [];
  const index = cart.findIndex(i => i.itemId === itemId);

  if (index === -1) {
    return res.status(404).json({ error: 'Cart item not found', code: 'ITEM_NOT_FOUND' });
  }

  cart.splice(index, 1);
  res.status(200).json({ message: 'Item removed' });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, carts };
