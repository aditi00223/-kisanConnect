const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  photos: [String],
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);