const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/wallet', require('./src/routes/walletRoutes'));
app.use('/api/forum', require('./src/routes/forumRoutes'));
app.use('/api/prices', require('./src/routes/priceRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'KisanConnect API is running 🌾' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));