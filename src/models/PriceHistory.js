const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);