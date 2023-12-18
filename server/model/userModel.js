const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
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
  displayName: {
    type: String,
  },
  googleId: {
    type: String,
  },
  otp:{
    type : String,
  },
  deleted : {
    type : Boolean,
    default : false
  }
});

userSchema.pre("save", async function (next) {
  if (this.googleId) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});
const userCollection = new mongoose.model("userCollection", userSchema);

module.exports = userCollection;
