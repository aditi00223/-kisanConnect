const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  placeOrder,
  confirmOrder,
  markPickedUp,
  getMyOrders
} = require('../controllers/orderController');

router.post('/', auth, placeOrder);
router.put('/:id/confirm', auth, confirmOrder);
router.put('/:id/pickup', auth, markPickedUp);
router.get('/my', auth, getMyOrders);

module.exports = router;