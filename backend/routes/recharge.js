const express = require('express');
const jwt = require('jsonwebtoken');
const Recharge = require('../models/Recharge');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { checkIgn } = require('../mlbbChecker');
dotenv.config();
const userInfo = {}; // temporary placeholder to avoid crash


const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payment_screenshots/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware to verify JWT and extract user info
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// GET /recharge/check-ign - check MLBB IGN before submission
router.get('/check-ign', authMiddleware, async (req, res) => {
  const { mlbbId, serverId } = req.query;
  if (!mlbbId || !serverId) {
    return res.status(400).json({ message: 'Please provide mlbbId and serverId' });
  }
  // Validate mlbbId and serverId format
  if (!/^\d{9}$/.test(mlbbId)) {
    return res.status(400).json({ message: 'mlbbId must be exactly 9 digits' });
  }
  if (!/^\d{4}$/.test(serverId)) {
    return res.status(400).json({ message: 'serverId must be exactly 4 digits' });
  }
  try {
    const userInfo = await checkIgn(mlbbId, serverId);
    res.json(userInfo);
  } catch (err) {
    res.status(400).json({ message: err.message || 'IGN check failed' });
  }
});

// POST /recharge/create - create recharge request and generate QR code
router.post('/create', authMiddleware, async (req, res) => {
  const { mlbbId, serverId, pack } = req.body;
  if (!mlbbId || !serverId || !pack) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  // Validate mlbbId and serverId format
  if (!/^\d{9}$/.test(mlbbId)) {
    return res.status(400).json({ message: 'mlbbId must be exactly 9 digits' });
  }
  if (!/^\d{4}$/.test(serverId)) {
    return res.status(400).json({ message: 'serverId must be exactly 4 digits' });
  }
  try {
    // Check MLBB IGN
    const ignName = await checkIgn(mlbbId, serverId);

    let diamond = 0;
    if (pack) {
      // Make regex case-insensitive and allow optional spaces
      const diamondMatch = pack.match(/(\d+)\s*diamonds/i);
      if (diamondMatch) {
        diamond = parseInt(diamondMatch[1], 10);
      }
    }

    const rechargeData = {
      mlbbId,
      serverId,
      pack,
      ignName,
      diamond,
      userId: req.user.id,
      status: 'PendingPayment',
    };

    console.log('Creating recharge with status:', rechargeData.status);

    const recharge = new Recharge(rechargeData);
    await recharge.save();

    // Generate UPI QR code data URL
    const upiId = process.env.UPI_ID;
    const amount = pack.replace(/[^0-9]/g, ''); // extract digits from pack string
    const upiString = `upi://pay?pa=${upiId}&pn=MobileLegendsRecharge&am=${amount}&cu=INR`;
    const qrCodeDataUrl = await qrcode.toDataURL(upiString);

    // Send email to site owner
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    if (!process.env.RECEIVE_EMAIL) {
      console.error('Error: RECEIVE_EMAIL environment variable is not defined.');
      return res.status(500).json({ message: 'Server configuration error: RECEIVE_EMAIL is not defined.' });
    } else {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.RECEIVE_EMAIL,
        subject: 'New Mobile Legends Recharge Request Created',
        html: `
          <h3>Recharge Request Created</h3>
          <p><strong>MLBB ID:</strong> ${mlbbId}</p>
          <p><strong>Server ID:</strong> ${serverId}</p>
          <p><strong>Pack:</strong> ${pack}</p>
          <p><strong>RS Price:</strong> ₹${amount}</p>
          <p><strong>IGN Name:</strong> ${ignName}</p>
          <p><strong>User ID:</strong> ${req.user.id}</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        }
      });
    }

    res.json({ message: 'Recharge request created', qrCodeDataUrl, rechargeId: recharge._id, ignName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

const fs = require('fs');


// POST /recharge/upload-payment - upload payment screenshot and update recharge status
router.post('/upload-payment', authMiddleware, upload.single('paymentScreenshot'), async (req, res) => {
  const { rechargeId } = req.body;
  if (!rechargeId) {
    return res.status(400).json({ message: 'Recharge ID is required' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Payment screenshot is required' });
  }
  try {
    const recharge = await Recharge.findById(rechargeId);
    if (!recharge) {
      return res.status(404).json({ message: 'Recharge request not found' });
    }
    recharge.paymentScreenshot = req.file.filename;
    recharge.status = 'PendingVerification';
    await recharge.save();

    // Fetch user email
    const user = await User.findById(recharge.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate user email presence and format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
      console.error('Invalid or missing user email:', user.email);
      // Optionally notify admin about missing/invalid email
      const adminTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      if (!process.env.RECEIVE_EMAIL) {
        console.error('Error: RECEIVE_EMAIL environment variable is not defined.');
      } else {
        const adminMailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER,
          subject: 'Invalid or Missing User Email for Payment Screenshot',
          html: `
            <p>Payment screenshot upload failed to send email due to invalid or missing user email.</p>
            <p>User ID: ${user._id}</p>
            <p>Recharge ID: ${rechargeId}</p>
            <p>User email: ${user.email || 'No email provided'}</p>
          `
        };
        adminTransporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
          if (adminError) {
            console.error('Error sending admin notification email:', adminError);
          } else {
            console.log('Admin notification email sent:', adminInfo.response);
          }
        });
      }

      return res.status(400).json({ message: 'Invalid or missing user email. Cannot send payment screenshot email.' });
    }

    // Send email with payment screenshot attached to user email

    // Suppression check: skip sending email if user email is flagged invalid or in suppression list
    if (user.email && user.email !== '' && !user.isEmailSuppressed) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const filePath = path.join(__dirname, '../uploads/payment_screenshots/', req.file.filename);
      if (!process.env.RECEIVE_EMAIL) {
        console.error('Error: RECEIVE_EMAIL environment variable is not defined.');
      } else {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.RECEIVE_EMAIL,  // send only to site owner email (rikhishkh@gmail.com)
          subject: 'Payment Screenshot Uploaded - Recharge Request',
          html: `
            <h3>A payment screenshot has been uploaded successfully.</h3>
            <p><strong>Recharge ID:</strong> ${rechargeId}</p>
            <p><strong>MLBB ID:</strong> ${recharge.mlbbId}</p>
            <p><strong>Server ID:</strong> ${recharge.serverId}</p>
            <p><strong>Pack:</strong> ${recharge.pack}</p>
            <p><strong>IGN Name:</strong> ${recharge.ignName}</p>
            <p>Thank you for your payment. Please verify the payment.</p>
          `,
          attachments: [
            {
              filename: req.file.filename,
              path: filePath
            }
          ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending payment screenshot email:', error);
            // If error is related to invalid recipient, flag user email to suppress future emails
            if (error.responseCode === 550 || error.message.includes('5.1.1')) {
              user.isEmailSuppressed = true;
              user.save().then(() => {
                console.log(`User email ${user.email} flagged as suppressed due to delivery failure.`);
              }).catch(saveErr => {
                console.error('Error saving suppression flag:', saveErr);
              });
            }
          } else {
            console.log('Payment screenshot email sent to user:', info.response);
          }
        });
      }
    } else {
      console.log(`Skipping email to suppressed or invalid user email: ${user.email}`);
    }

    res.json({ message: 'Payment screenshot uploaded successfully', mlbbId: recharge.mlbbId, serverId: recharge.serverId, pack: recharge.pack, ignName: recharge.ignName, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /recharge/all - admin only: fetch all recharge requests
router.get('/all', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    let recharges = await Recharge.find().populate('userId', 'name email').sort({ createdAt: -1 });
    // Add amount field extracted from pack string
    recharges = recharges.map(r => {
      const amount = r.pack ? r.pack.replace(/[^0-9]/g, '') : '';
      let diamond = r.diamond || 0;
      if (r.pack) {
        const diamondMatch = r.pack.match(/(\d+)\s*Diamonds/);
        if (diamondMatch) {
          diamond = parseInt(diamondMatch[1], 10);
        }
      }
      return {
        ...r._doc,
        amount,
        diamond,
      };
    });
    res.json(recharges);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /recharge/status/:id - check payment status of recharge request
router.get('/status/:id', authMiddleware, async (req, res) => {
  const rechargeId = req.params.id;
  try {
    const recharge = await Recharge.findById(rechargeId);
    if (!recharge) {
      return res.status(404).json({ message: 'Recharge request not found' });
    }
    // For demo, assume status field indicates payment status
    // In real scenario, integrate with payment gateway to verify payment
    res.json({ status: recharge.status });
  } catch (err) {
    console.error('Error checking recharge status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /recharge/verify-payment/:id - admin only: verify payment and update status
router.post('/verify-payment/:id', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const rechargeId = req.params.id;
  const { status } = req.body; // expected 'Processed' or 'Failed'
  if (!['Processed', 'Failed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  try {
    const recharge = await Recharge.findById(rechargeId);
    if (!recharge) {
      return res.status(404).json({ message: 'Recharge request not found' });
    }
    recharge.status = status;
    await recharge.save();

    // Notify user by email about status update
    const user = await User.findById(recharge.userId);
    if (user && user.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      if (!process.env.RECEIVE_EMAIL) {
        console.error('Error: RECEIVE_EMAIL environment variable is not defined.');
      } else {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.RECEIVE_EMAIL,
          subject: `Recharge Payment ${status}`,
          html: `
            <h3>Your recharge payment has been ${status.toLowerCase()}.</h3>
            <p>MLBB ID: ${recharge.mlbbId}</p>
            <p>Server ID: ${recharge.serverId}</p>
            <p>Pack: ${recharge.pack}</p>
            <p>IGN Name: ${recharge.ignName}</p>
            <p>Status: ${status}</p>
          `
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending payment status email:', error);
          } else {
            console.log('Payment status email sent:', info.response);
          }
        });
      }
    }

    res.json({ message: `Recharge status updated to ${status}` });
  } catch (err) {
    console.error('Error updating recharge status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /recharge/user - get recharge requests for logged-in user
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let recharges = await Recharge.find({ userId }).sort({ createdAt: -1 });
    recharges = recharges.map(r => {
      const amount = r.pack ? r.pack.replace(/[^0-9]/g, '') : '';
      let diamond = r.diamond || 0;
      if (r.pack) {
        const diamondMatch = r.pack.match(/(\d+)\s*Diamonds/i);
        if (diamondMatch) {
          diamond = parseInt(diamondMatch[1], 10);
        }
      }
      return {
        ...r._doc,
        amount,
        diamond,
      };
    });
    res.json(recharges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
