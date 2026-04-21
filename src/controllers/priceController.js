const PriceHistory = require('../models/PriceHistory');

// GET PRICE HISTORY
exports.getPriceHistory = async (req, res) => {
  try {
    const { crop } = req.query;

    let filter = {};
    if (crop) filter.crop = new RegExp(crop, 'i');

    const prices = await PriceHistory.find(filter)
      .sort({ date: 1 });

    res.json({ prices });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD PRICE (admin use)
exports.addPrice = async (req, res) => {
  try {
    const { crop, price, date, location } = req.body;

    const entry = await PriceHistory.create({ crop, price, date, location });

    res.status(201).json({ message: 'Price added', entry });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};