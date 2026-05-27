const express = require('express');
const router = express.Router();
const { checkout, getOrders } = require('../controllers/orders.controller');

// Mounted at /api — handles /api/checkout and /api/orders
router.post('/checkout', checkout);
router.get('/orders', getOrders);

module.exports = router;
