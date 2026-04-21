const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPriceHistory,
  addPrice
} = require('../controllers/priceController');

router.get('/', getPriceHistory);
router.post('/', auth, addPrice);

module.exports = router;