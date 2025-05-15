
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { checkIgn } = require('../mlbbChecker');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
dotenv.config();

function generateVerificationToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

async function sendVerificationEmail(user, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: 'Please verify your email address',
    html: `
      <h3>Email Verification</h3>
      <p>Hi ${user.name},</p>
      <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Signup request body:', req.body);
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Signup error: User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password, isVerified: true });
    await user.save();

    // Removed email verification email sending

    res.status(201).json({ message: 'Signup successful. You can now log in.' });
  } catch (err) {
    console.error('Signup error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
});

// Email verification route
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).send('Invalid verification link.');
    }
    if (user.isVerified) {
      return res.status(200).send('Email already verified.');
    }
    user.isVerified = true;
    await user.save();
    res.status(200).send('Email verification successful. You can now log in.');
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(400).send('Invalid or expired verification link.');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request body:', req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login error: No user found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Temporarily bypass email verification for testing
    // if (!user.isVerified) {
    //   return res.status(403).json({ message: 'Please verify your email before logging in.' });
    // }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login error: Password mismatch for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If email and password match the special case, set isAdmin to true
    if (email === 'rikhishkh@gmail.com' && password === 'r' && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
      console.log(`User ${email} set as admin during login`);
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
    };
    console.log('Generating token with payload:', payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
});

router.get('/check-ign/:mlbbId/:serverId', async (req, res) => {
  const { mlbbId, serverId } = req.params;
  try {
    const ign = await checkIgn(mlbbId, serverId);
    res.json({ ign });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin route to update user's isAdmin status
router.put('/admin/:userId', verifyToken, verifyAdmin, async (req, res) => {
  const { userId } = req.params;
  const { isAdmin } = req.body;
  if (typeof isAdmin !== 'boolean') {
    return res.status(400).json({ message: 'isAdmin must be a boolean' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isAdmin = isAdmin;
    await user.save();
    res.json({ message: `User admin status updated to ${isAdmin}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
