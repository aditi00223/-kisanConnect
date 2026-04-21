const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (farmer only)
router.post('/', auth, addProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;