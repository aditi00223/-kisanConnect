const Wallet = require('../models/Wallet');

// GET FARMER WALLET
exports.getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ farmer: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({ farmer: req.user.id, balance: 0, transactions: [] });
    }

    res.json({ wallet });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET TRANSACTION HISTORY
exports.getTransactions = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ farmer: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({ transactions: wallet.transactions });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};