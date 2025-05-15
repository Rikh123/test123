const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const rechargeRoutes = require('./routes/recharge');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://10.65.20.173:3000', 'http://192.168.137.1:3000'];

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/recharge', rechargeRoutes);

const PORT = process.env.PORT || 5000;

let server;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = { app, server };
