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
  verified: {
    type: Boolean,
  },
  displayName: {
    type: String,
  },
  googleId: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (this.googleId) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.password, 10);
    next();
  }
});
const userCollection = new mongoose.model("userCollection", userSchema);

module.exports = userCollection;
