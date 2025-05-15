const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const payload = {
  id: 'user123',
  email: 'user123@example.com',
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('Generated JWT:', token);
