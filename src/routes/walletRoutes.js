const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getWallet,
  getTransactions
} = require('../controllers/walletController');

router.get('/', auth, getWallet);
router.get('/transactions', auth, getTransactions);

module.exports = router;