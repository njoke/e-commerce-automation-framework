const { carts } = require('./cart.controller');

// In-memory orders store
const orders = [];

const TAX_RATE = 0.10;

const checkout = (req, res) => {
  const userId = req.headers['x-user-id'] || req.body.userId;
  const { firstName, lastName, email, address, city, state, zip, items } = req.body;

  const required = { firstName, lastName, email, address, city, state, zip };
  for (const [field, val] of Object.entries(required)) {
    if (!val) {
      return res.status(400).json({ error: `Missing required field: ${field}`, code: 'MISSING_FIELD' });
    }
  }

  const cartItems = items || carts[userId] || [];
  if (!cartItems.length) {
    return res.status(400).json({ error: 'Cart is empty', code: 'EMPTY_CART' });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const orderId = `ORD-${dateStr}-${String(orders.length + 1).padStart(3, '0')}`;

  const order = {
    orderId,
    userId,
    items: cartItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax,
    total,
    createdAt: now.toISOString()
  };

  orders.push(order);

  // Clear cart after successful checkout
  if (carts[userId]) carts[userId] = [];

  res.status(201).json(order);
};

const getOrders = (req, res) => {
  const userId = req.headers['x-user-id'];
  const userOrders = orders.filter(o => o.userId === userId);
  res.status(200).json(userOrders);
};

module.exports = { checkout, getOrders };
