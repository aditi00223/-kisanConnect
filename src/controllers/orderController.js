const Order = require('../models/Order');
const Product = require('../models/Product');
const Wallet = require('../models/Wallet');

// PLACE ORDER (buyer)
exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }

    const totalPrice = quantity * product.pricePerUnit;

    const order = await Order.create({
      buyer: req.user.id,
      farmer: product.farmer,
      product: productId,
      quantity,
      totalPrice,
      paymentMethod,
      status: 'placed',
      paymentStatus: paymentMethod === 'upi' ? 'held' : 'pending'
    });

    // Reduce product quantity
    product.quantity -= quantity;
    if (product.quantity === 0) product.isAvailable = false;
    await product.save();

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CONFIRM ORDER (farmer)
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'confirmed';
    await order.save();

    res.json({ message: 'Order confirmed', order });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// MARK AS PICKED UP (buyer)
exports.markPickedUp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'pickedup';
    order.paymentStatus = 'released';
    await order.save();

    // Release payment to farmer wallet
    let wallet = await Wallet.findOne({ farmer: order.farmer });
    if (!wallet) {
      wallet = await Wallet.create({ farmer: order.farmer, balance: 0, transactions: [] });
    }

    wallet.balance += order.totalPrice;
    wallet.transactions.push({
      amount: order.totalPrice,
      type: 'credit',
      description: 'Payment released after pickup',
      order: order._id
    });
    await wallet.save();

    res.json({ message: 'Order marked as picked up, payment released to farmer', order });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'buyer') {
      orders = await Order.find({ buyer: req.user.id })
        .populate('product', 'name pricePerUnit unit')
        .populate('farmer', 'name phone')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ farmer: req.user.id })
        .populate('product', 'name pricePerUnit unit')
        .populate('buyer', 'name phone')
        .sort({ createdAt: -1 });
    }

    res.json({ orders });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};