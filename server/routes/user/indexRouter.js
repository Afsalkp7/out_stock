const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;
const userCollection = require("../../model/userModel");
const { auth } = require("../../middlewere/user_auth");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { token } = require("morgan");
const session = require("express-session");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const userOtpVerification = require("../../model/userOtpModel");
require("../../middlewere/googleAuth");
const passport = require("passport");
const twilio = require("twilio");
const OTPModel = require("../../model/otpModel");
const { isLogged } = require("../../middlewere/user_auth");
const libphonenumber = require("google-libphonenumber");
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config({ path: "config.env" });
const { config } = require("dotenv");
const Banner = require("../../model/bannerModel");
const Product = require("../../model/productModel");
const Order = require("../../model/oraderModel");
const Cart = require("../../model/cartModel");
const WishItem = require("../../model/wishModel");
const PlaceOrder = require("../../model/orderPlaceModel");
const otpCollection = require("../../model/userOtpModel");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "afsalkpmanu31@gmail.com",
    pass: "hold thhr ucgt iaqu",
  },
});

const sendOTPByEmail = (email, otp, subject) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "afsalkpmanu31@gmail.com",
      to: email,
      subject: "OTP FROM OUTSTOCK",
      text: `HI , Your One Time Password (OTP) for ${subject} is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info.response);
      }
    });
  });
};

const serviseSid = process.env.serviceSid;
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
// console.log("authToken",authToken);
// console.log("serviseSid",serviseSid);
// console.log("accountSid",accountSid);
const client = new twilio(accountSid, authToken);

router.get("/", async (req, res) => {
  const topBanner = await Banner.find({ place: "top", status: "Enable" });
  const centerBanner = await Banner.find({ place: "center", status: "Enable" });
  const bottomBanner = await Banner.find({ place: "bottom", status: "Enable" });
  const newArrivalSort = await Product.find().sort({ dateCreated: -1 });
  const arrivalArray = newArrivalSort.slice(0, 8);
  const mostSelled = await PlaceOrder.aggregate([
    {
      $unwind: {
        path: "$orderItems",
      },
    },
    {
      $group: {
        _id: "$orderItems.productId",
        totalSold: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 4,
    },
  ]);
  const productArray = [];
  for (let i = 0; i < mostSelled.length; i++) {
    var product = await Product.findById(mostSelled[i]._id);
    productArray.push(product);
  }

  const mostOrdered = await PlaceOrder.aggregate([
    {
      $unwind: {
        path: "$orderItems",
      },
    },
    {
      $group: {
        _id: "$orderItems.productId",
        totalSold: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 8,
    },
  ]);

  const dateCreated = [];
  for (let i = 0; i < mostOrdered.length; i++) {
    var product = await Product.findById(mostOrdered[i]._id);
    dateCreated.push(product);
  }

  const trendingArray = dateCreated.slice(4);

  return res.render("index", {
    topBanner,
    productArray,
    centerBanner,
    trendingArray,
    arrivalArray,
    bottomBanner,
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/auth/google/failure", isLogged, (req, res) => {
  res.send("something error....!!!");
});

router.get("/auth/protected", isLogged, (req, res) => {
  const userId = req.user._id;
  const token = jwt.sign({ userId }, secretKey);
  res.cookie("usersession", token);
  return res.redirect("/");
  // res.render("user_details",{user:req.user})
});

router.get("/user", (req, res) => {
  const token = req.cookies.usersession;
  if (token) {
    res.redirect("/user_data");
  } else {
    try {
      res.render("userlogin");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
    
  }
});

router.get("/registration", (req, res) => {
  res.render("userregister");
});

// router.post(
//   "/register",
//   urlencodedParser,
//   [
//     check("userName", "User name must be 3 characters")
//       .exists()
//       .isLength({ min: 3 }),
//     check("email", "Email is not valid").exists().isEmail().normalizeEmail(),
//     check("phone", "entered phone number is not valid")
//       .exists()
//       .isLength({ min: 10 })
//       .isMobilePhone(),
//     check("password", "password must need alphanumeic,regex,and 8 character")
//       .exists()
//       .isLength({ min: 8, max: 25 })
//       .isAlphanumeric(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorArray = errors.array();
//       const alert = errorArray[0];
//       console.log(alert);
//       return res.render("userregister", { alert: alert });
//     }
//     try {
//       const password = req.body.password;
//       const cpassword = req.body.cpassword;
//       if (password === cpassword) {
//         const generateOTP = () => {
//           return Math.floor(
//             1000 + Math.random() * (900000 - 100000 + 1)
//           ).toString();
//         };
//         const otp = generateOTP();
//         console.log(otp);
//         if (otp) {
//           const userName = req.body.userName;
//           const email = req.body.email;
//           const phoneNumber = req.body.phone;
//           const status = req.body.status;
//           const verified = req.body.verified;
//           console.log(process.env.twilioPhoneNumber);

//           const parsedPhoneNumber = phoneUtil.parse(phoneNumber, "IN");
//           const phone = phoneUtil.format(
//             parsedPhoneNumber,
//             libphonenumber.PhoneNumberFormat.E164
//           );
//           console.log("Formatted phone number:", phone);
//           console.log(process.env.twilioPhoneNumber);
//            client.messages
//               .create({
//                 body: `Your OTP: ${otp}`,
//                 from: process.env.twilioPhoneNumber,
//                 to: phone,
//               })
//               .then(async (message) => {
//                 console.log(`OTP sent with message SID: ${message.sid}`);
//                 const otpData = new OTPModel({
//                   userName,
//                   email,
//                   phone,
//                   password,
//                   otp,
//                   status,
//                   verified,
//                 });
//                 await otpData.save();
//                 console.log(otpData);
//                 res.render("verifyotp");
//               });
//         } else {
//           res.render("userregister", { notMatch: true });
//         }
//       } else {
//         res.render("userregister", { notMatch: true });
//       }
//     } catch (error) {
//       res.send(error);
//     }
//   }
// );

router.post("/register", async (req, res) => {
  const allreadyUser = await userCollection.findOne({ email: req.body.email });
  if (allreadyUser) {
    return res.render("userregister", { allready: true });
  }else{
    try {
      const password = req.body.password;
      const cpassword = req.body.cpassword;
      if (password === cpassword) {
        const phoneNumber = req.body.phone;
        const parsedPhoneNumber = phoneUtil.parse(phoneNumber, "IN");
        const phone = phoneUtil.format(
          parsedPhoneNumber,
          libphonenumber.PhoneNumberFormat.E164
        );
        const generateOTP = () => {
          return Math.floor(100000 + Math.random() * 900000);
        };
        const email = req.body.email;
        const otp = generateOTP();
        const userData = new otpCollection({
          userName: req.body.userName,
          email,
          phone,
          password: req.body.password,
          cpassword: req.body.cpassword,
          status: req.body.status,
          otp: "",
        });
        await userData.save();
        const subject = "For registration on OUTSTOCK furniture";
        const getOtp = sendOTPByEmail(email, otp, subject);
        if (getOtp) {
          const otpUpdate = await otpCollection.findOneAndUpdate(
            { email },
            { $set: { otp: otp } }
          );
          if (otpUpdate) {
            const email = await otpUpdate.email;
            return res.render("otpcolumnForRegistration", { email });
          } else {
            console.log("otp not updated");
          }
        } else {
          return res.render("userregister", { notValid: true });
        }
      } else {
        res.render("userregister", { notMatch: true });
      }
    } catch (error) {
      res.send(error);
    }
  }
  
});

router.get("/user_data", auth, async (req, res) => {
  const token = req.cookies.usersession;
  if (token) {
    const _id = req.userId;
    console.log(_id);
    const user = await userCollection.findOne({ _id });
    res.render("user_details", { user });
  } else {
    res.render("userlogin", { notfound: true });
  }
});

router.post("/user_login", async (req, res) => {
  const { email, password } = req.body;
  const userProfile = await userCollection.findOne({ email });
  if (!userProfile) {
    return res.render("userlogin", { notExist: true });
  }
  try {
    if (userProfile.status == "active") {
      if (
        userProfile &&
        (await bcrypt.compare(password, userProfile.password))
      ) {
        const token = jwt.sign({ userId: userProfile._id }, secretKey);
        res.cookie("usersession", token);
        return res.redirect("/");
      } else {
        res.render("userlogin", { valid: true });
      }
    } else {
      res.render("userlogin", { blocked: true });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/update", auth, async (req, res) => {
  const user_id = req.body._id;
  console.log(user_id);
  const updatedData = await userCollection.updateOne(
    { _id: user_id },
    { $set: req.body }
  );
  res.json({ updatedData });
});

router.get("/logout", (req, res) => {
  const token = req.cookies.usersession;
  if (token) {
    res.clearCookie("usersession");
    res.redirect("/user");
  } else {
    res.render("userlogin");
  }
});

router.put("/change_password", auth, async (req, res) => {
  try {
    const userId = req.body._id;
    const currentPassword = req.body.oldPass;
    const newPassword = req.body.newPass;
    const confirmPassword = req.body.rePass;

    const user = await userCollection.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const curPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!curPasswordMatch) {
      return res.status(401).send("Current password is incorrect....");
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).send("New passwords do not match.....");
    }

    user.password = newPassword;
    await user.save();
    res.clearCookie("usersession");
    return res.json({ message: "changed" });
  } catch (error) {
    console.log(error);
    res.send("error identified...");
  }
});

router.get("/forgot", (req, res) => {
  if (req.cookies.usersession) {
    return res.redirect("/");
  }
  return res.render("forgot");
});

router.post("/forgot", async (req, res) => {
  const email = req.body.email;
  try {
    const userProfile = await userCollection.findOne({ email });
    if (userProfile) {
      if (userProfile.status == "active") {
        const generateOTP = () => {
          return Math.floor(100000 + Math.random() * 900000);
        };
        const otp = generateOTP();
        const subject = "For recovering your password";
        const getOtp = sendOTPByEmail(email, otp, subject);
        if (getOtp) {
          const otpUpdate = await userCollection.findOneAndUpdate(
            { email },
            { $set: { otp: otp } }
          );
          if (otpUpdate) {
            const email = await otpUpdate.email;
            return res.render("otpcolumn", { email });
          }
        }
      }
    } else {
      res.render("userlogin", { valid: true });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/otp", async (req, res) => {
  const { email, otp } = req.body;
  const reqUser = await userCollection.findOne({ email });
  if (otp == reqUser.otp) {
    res.render("changeForm", { id: reqUser._id });
  } else {
    console.log(email);
    res.render("otpcolumn", { email, notMatch: true });
  }
});

router.post("/confirmPass", async (req, res) => {
  const { password, confirmPassword, _id } = req.body;
  try {
    if (password === confirmPassword) {
      const user = await userCollection.findById(_id);
      console.log(user);
      user.password = password;
      await user.save();
      return res.render("userlogin");
    } else {
      res.render("changeForm", { id: _id, incorrect: true });
    }
  } catch (error) {
    return res.send(error);
  }
});

router.get("/delete", auth, async (req, res) => {
  const userId = req.userId;
  res.json(userId);
});

router.delete("/delete", auth, async (req, res) => {
  const userId = req.userId;
  await Order.deleteMany({ userId });
  await Cart.deleteMany({ userId });
  await WishItem.deleteMany({ userId });
  await PlaceOrder.deleteMany({ userId });
  const deleteUser = await userCollection.findOneAndRemove({ _id: userId });
  console.log(deleteUser);
  res.clearCookie("usersession");
  res.json(deleteUser);
});

router.post("/registerOtp", async (req, res) => {
  const { email, otp } = req.body;
  const reqUser = await otpCollection.findOne({ email });
  if (otp == reqUser.otp) {
    const userData = new userCollection({
      userName: reqUser.userName,
      email: reqUser.email,
      phone: reqUser.phone,
      password: reqUser.password,
      cpassword: reqUser.cpassword,
      status: reqUser.status,
    });
    await userData.save();
    await otpCollection.findOneAndRemove({ email });
    res.render("userlogin");
  } else {
    console.log(email);
    res.render("otpcolumnForRegistration", { email, notMatch: true });
  }
});

module.exports = router;
