const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({

   userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  otp: String,
  createdAt: { type: Date, expires: '5m', default: Date.now },
});

const OTPModel = mongoose.model('OTP', otpSchema)


module.exports = OTPModel;  