const mongoose = require("mongoose");

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
  otp:{
    type : String,
  }
});

const otpCollection = new mongoose.model("otpCollection", otpSchema);

module.exports = otpCollection;
