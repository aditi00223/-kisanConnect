const Product = require('../models/Product');

// ADD CROP LISTING
exports.addProduct = async (req, res) => {
  try {
    const { name, category, quantity, unit, pricePerUnit, description, photos, location, coordinates } = req.body;

    const product = await Product.create({
      farmer: req.user.id,
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      description,
      photos,
      location,
      coordinates
    });

    res.status(201).json({ message: 'Crop listed successfully', product });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL PRODUCTS with filters
exports.getProducts = async (req, res) => {
  try {
    const { category, location } = req.query;

    let filter = { isAvailable: true };
    if (category) filter.category = new RegExp(category, 'i');
    if (location) filter.location = new RegExp(location, 'i');

    const products = await Product.find(filter)
      .populate('farmer', 'name phone location rating')
      .sort({ createdAt: -1 });

    res.json({ products });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name phone location rating');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only the farmer who created it can update
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Product updated', product: updated });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};