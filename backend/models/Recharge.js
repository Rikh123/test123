const mongoose = require('mongoose');

const RechargeSchema = new mongoose.Schema({
  mlbbId: {
    type: String,
    required: true,
    trim: true,
  },
  serverId: {
    type: String,
    required: true,
    trim: true,
  },
  pack: {
    type: String,
    required: true,
  },
  ignName: {
    type: String,
    trim: true,
  },
  diamond: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentScreenshot: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'PendingPayment', 'PendingVerification', 'Processed', 'Failed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Recharge', RechargeSchema);
