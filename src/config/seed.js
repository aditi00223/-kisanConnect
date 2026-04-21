const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const PriceHistory = require('../models/PriceHistory');

const seedPrices = [
  // Wheat
  { crop: 'Wheat', price: 18, date: new Date('2025-11-01'), location: 'Punjab' },
  { crop: 'Wheat', price: 19, date: new Date('2025-12-01'), location: 'Punjab' },
  { crop: 'Wheat', price: 20, date: new Date('2026-01-01'), location: 'Punjab' },
  { crop: 'Wheat', price: 21, date: new Date('2026-02-01'), location: 'Punjab' },
  { crop: 'Wheat', price: 22, date: new Date('2026-03-01'), location: 'Punjab' },
  { crop: 'Wheat', price: 23, date: new Date('2026-04-01'), location: 'Punjab' },

  // Rice
  { crop: 'Rice', price: 30, date: new Date('2025-11-01'), location: 'Punjab' },
  { crop: 'Rice', price: 31, date: new Date('2025-12-01'), location: 'Punjab' },
  { crop: 'Rice', price: 29, date: new Date('2026-01-01'), location: 'Punjab' },
  { crop: 'Rice', price: 32, date: new Date('2026-02-01'), location: 'Punjab' },
  { crop: 'Rice', price: 33, date: new Date('2026-03-01'), location: 'Punjab' },
  { crop: 'Rice', price: 35, date: new Date('2026-04-01'), location: 'Punjab' },

  // Maize
  { crop: 'Maize', price: 15, date: new Date('2025-11-01'), location: 'Punjab' },
  { crop: 'Maize', price: 16, date: new Date('2025-12-01'), location: 'Punjab' },
  { crop: 'Maize', price: 15, date: new Date('2026-01-01'), location: 'Punjab' },
  { crop: 'Maize', price: 17, date: new Date('2026-02-01'), location: 'Punjab' },
  { crop: 'Maize', price: 18, date: new Date('2026-03-01'), location: 'Punjab' },
  { crop: 'Maize', price: 19, date: new Date('2026-04-01'), location: 'Punjab' },

  // Mustard
  { crop: 'Mustard', price: 50, date: new Date('2025-11-01'), location: 'Punjab' },
  { crop: 'Mustard', price: 52, date: new Date('2025-12-01'), location: 'Punjab' },
  { crop: 'Mustard', price: 55, date: new Date('2026-01-01'), location: 'Punjab' },
  { crop: 'Mustard', price: 53, date: new Date('2026-02-01'), location: 'Punjab' },
  { crop: 'Mustard', price: 57, date: new Date('2026-03-01'), location: 'Punjab' },
  { crop: 'Mustard', price: 60, date: new Date('2026-04-01'), location: 'Punjab' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ✅');

    await PriceHistory.deleteMany({});
    console.log('Old price data cleared 🗑️');

    await PriceHistory.insertMany(seedPrices);
    console.log('Seed data inserted successfully 🌱');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed ❌', error.message);
    process.exit(1);
  }
};

seedDB();