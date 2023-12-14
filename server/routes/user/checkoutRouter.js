const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel");
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel");
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");
const Coupon = require("../../model/couponModel");

router.get("/", authCart, async (req, res) => {
  const userId = req.userId;
  const orderAddress = await Order.find({ userId });

  if (req.cookies.buynowPrduct) {
    const cartProducts = [];
    const productId = req.cookies.buynowPrduct;
    const quantity = parseInt(req.cookies.buynowQuantity);
    const cartContent = await Product.find({ _id: productId });
    if (cartContent) {
      cartProducts.push({ cartContent, quantity });
    }
    console.log(cartProducts);
    return res.render("checkout", { orderAddress, cartProducts });
  } else {
    const cartItems = await CartItem.find({ userId });
    const cartProducts = [];

    for (let cartItem of cartItems) {
      const productId = cartItem.productId;
      const quantity = cartItem.quantity;

      const cartContent = await Product.find({ _id: productId });
      if (cartContent) {
        cartProducts.push({ cartContent, quantity });
      }
    }
    console.log(cartProducts, orderAddress);
    return res.render("checkout", { orderAddress, cartProducts });
  }
});

router.post("/order", authCart, async (req, res) => {
  const userId = req.userId;
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    address2,
    country,
    state,
    pin,
    id,
    couponId,
  } = req.body;
  if (id) {
    const existAdress = await Order.findOne({ userId, _id: id });
    if (existAdress) {
      if (couponId != "") {
        const updateAddress = await Order.updateOne(
          { _id: id },
          {
            $set: {
              firstName,
              lastName,
              email,
              phone,
              address,
              address2,
              country,
              state,
              pin,
              id,
              couponId,
            },
          }
        );
        if (updateAddress) {
          const checkOutData = await Order.findOne({ userId, _id: id });

          console.log("checkOutData", checkOutData);
          res.json(checkOutData);
        }
      } else {
        const updateAddress = await Order.updateOne(
          { _id: id },
          {
            $set: {
              firstName,
              lastName,
              email,
              phone,
              address,
              address2,
              country,
              state,
              pin,
              id,
            },
          }
        );
        if (updateAddress) {
          const checkOutData = await Order.findOne({ userId, _id: id });

          console.log("checkOutData", checkOutData);
          res.json(checkOutData);
        }
      }
    }
  } else {
    if (couponId != "") {
      const checkOutData = new Order({
        userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        address2,
        country,
        state,
        pin,
        couponId,
      });
      await checkOutData.save();
      console.log("checkOutData", checkOutData);
      res.json(checkOutData);
    } else {
      const checkOutData = new Order({
        userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        address2,
        country,
        state,
        pin,
      });
      await checkOutData.save();
      console.log("checkOutData", checkOutData);
      res.json(checkOutData);
    }
  }
});

router.get("/order/:id", authCart, async (req, res) => {
  const userId = req.userId;
  const addressId = req.params.id;
  const checkOutData = await Order.findOne({ userId, _id: addressId });

  if (req.cookies.buynowPrduct) {
    const cartProducts = [];
    const productId = req.cookies.buynowPrduct;
    const quantity = parseInt(req.cookies.buynowQuantity);
    const cartContent = await Product.find({ _id: productId });
    if (cartContent) {
      cartProducts.push({ cartContent, quantity });
    }
    if (checkOutData.couponId) {
      let coupon = await Coupon.findOne({ _id: checkOutData.couponId });
      console.log(coupon);
      res.render("payment", {
        checkOutData,
        cartProducts,
        coupon,
        couponApplied: true,
      });
    } else {
      res.render("payment", { checkOutData, cartProducts });
    }
  } else {
    const cartItems = await CartItem.find({ userId });
    const cartProducts = [];

    for (let cartItem of cartItems) {
      const productId = cartItem.productId;
      const quantity = cartItem.quantity;

      const cartContent = await Product.find({ _id: productId });
      if (cartContent) {
        cartProducts.push({ cartContent, quantity });
      }
    }
    if (checkOutData.couponId) {
      let coupon = await Coupon.findOne({ _id: checkOutData.couponId });
      console.log(coupon);
      res.render("payment", {
        checkOutData,
        cartProducts,
        coupon,
        couponApplied: true,
      });
    } else {
      res.render("payment", { checkOutData, cartProducts });
    }
  }
});

router.get("/delete/:id", async (req, res) => {
  addressId = req.params.id;
  try {
    const address = await Order.findOne({ _id: addressId });

    if (address) {
      return res.json(address);
    } else {
      res.status(404).json({ error: "address not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/", async (req, res) => {
  const addressId = req.body.adr_id;
  const deleteAddress = await Order.findByIdAndRemove(addressId);
  return res.json(deleteAddress);
});

router.get("/coupon/:code", authCart, async (req, res) => {
  const userId = req.userId;
  const code = req.params.code;
  const match = await Coupon.findOne({ couponCode: code });
  if (match) {
    const validity = match.startDate > new Date() < match.endDate;
    if (validity) {
      res.json(match);
    }
  }
});

// router.post("/coupon/:id", authCart, async (req, res) => {
//   const couponId = req.params.id;
// });

router.post("/buynow/:id", authCart, async (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);
  res.cookie("buynowQuantity", quantity);
  res.cookie("buynowPrduct", productId);
  res.json(productId);
});

module.exports = router;
