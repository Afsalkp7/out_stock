const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel");
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel");
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");
const Coupon=require("../../model/couponModel")

router.post("/", authCart, async (req, res) => {
  
  const userId = req.userId;
  const orderAddress = await Order.find({ userId });
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
  const grandTotal = req.body.grandToCheck;
  console.log(grandTotal, cartProducts, orderAddress);
  res.render("checkout", { grandTotal, cartProducts, orderAddress });
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
    grandTotal,
  } = req.body;
  if (id) {
    const existAdress = await Order.findOne({ userId, _id: id });
    if (existAdress) {
      const updateAddress = await Order.updateOne(
        { _id:id },
        { $set: req.body }
      );
      if (updateAddress) {
        const checkOutData = await Order.findOne({ userId, _id: id });
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
        return res.render("payment", { grandTotal , checkOutData , cartProducts});
      }
    }
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
    res.render("payment", { grandTotal , checkOutData , cartProducts });
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

router.get("/coupon/:code",authCart,async(req,res)=>{
  const userId = req.userId
  const code = req.params.code
  const match = await Coupon.findOne({couponCode:code})
  if (match){
    const validity = match.startDate>new Date()<match.endDate
    if (validity){
      res.json(match)
    }
  }
  
})

module.exports = router;
