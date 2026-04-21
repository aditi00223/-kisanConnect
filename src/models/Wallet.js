const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [
    {
      amount: Number,
      type: {
        type: String,
        enum: ['credit', 'debit']
      },
      description: String,
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);