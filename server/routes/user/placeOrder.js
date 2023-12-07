const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel");
const PlaceOrder = require("../../model/orderPlaceModel");
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel");
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");
const Razorpay = require("razorpay");
const Coupon = require("../../model/couponModel");
const { log } = require("console");

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

router.post("/", authCart, async (req, res) => {
  console.log(req.body);
  const userId = req.userId;
  const { orderId, paymentMethod } = req.body;
  const address = await Order.findById(orderId);
  const cartItems = await CartItem.find({ userId });
  const orderedProducts = [];
  for (let cartItem of cartItems) {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;
    orderedProducts.push({ productId, quantity });
  }

  let grandTotal = 0;
  for (let i = 0; i < orderedProducts.length; i++) {
    var qty = orderedProducts[i].quantity;
    var product = await Product.findById(orderedProducts[i].productId);
    var price = product.price;
    var total = price * qty;
    grandTotal += total;
  }
  var discound=0;
  if(address.couponId!=undefined){
    const coupon = await Coupon.findById(address.couponId)
    let grandToCheck = grandTotal 
      if (coupon.couponType == "%"){
        discound = parseInt((grandToCheck*coupon.couponProfit)/100);
        console.log(discound);
        if (discound > coupon.maxDis){
          discound = coupon.maxDis
          grandTotal = grandToCheck - coupon.maxDis
        }else{
          
          grandTotal = grandToCheck - discound
        }
    }else {
      discound = parseInt(coupon.couponProfit);
        console.log(discound);
        if (discound > grandToCheck){
          discound = parseInt((discound*50)/100);
          grandTotal = grandToCheck - discound
        }else{
          grandTotal = grandToCheck - discound
        }
    }
  }

  if (paymentMethod == "cash on delivery") {
    try {
      const orderData = new PlaceOrder({
        userId,
        addressId: orderId,
        totalAmount: grandTotal,
        paymentId: paymentMethod,
        orderStatus: "Order Placed",
        orderItems: orderedProducts,
        discound : discound
      });
      await orderData.save();
      const deleteCart = await CartItem.deleteMany({ userId });
      if (deleteCart) {
        res.json(orderData);
      }
    } catch (error) {
      res.render("error", { error });
    }
  }else{
    try {
      const orderData = new PlaceOrder({
        userId,
        addressId: orderId,
        totalAmount: grandTotal,
        paymentId: paymentMethod,
        orderStatus: "Order Placed",
        orderItems: orderedProducts,
        discound : discound
      });
      await orderData.save();
      const deleteCart = await CartItem.deleteMany({ userId });
      if (deleteCart) {
        res.json(orderData);
      }
    } catch (error) {
      res.render("error", { error });
    }
  }
});

router.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  const orderData = await PlaceOrder.findById(orderId);
  const address = await Order.findById(orderData.addressId);
  const orderedItems = orderData.orderItems;
  console.log(orderedItems);
  let orders = [];
  let sum = 0;
  for (let ordereditem of orderedItems) {
    const productId = ordereditem.productId;
    const qty = ordereditem.quantity;
    const productData = await Product.findById(productId);
    let newQty = productData.quantity - qty;
    await Product.updateOne(
      { _id: productId },
      { $set: { quantity: newQty } }
    );
    sum = sum + productData.price * qty;
    orders.push({ productData, qty });
  }

  

  if(address.couponId){
    await Order.updateOne(
      { _id: address._id }, 
      { $unset: { couponId: "" } }, 
      { multi: false }
    )
  }
  

  return res.render("orderSummery", {
    ordered: true,
    address,
    orderData,
    orders,
    sum,
  });
});

router.post("/create/orderId", (req, res) => {
  console.log(req.body);
  var options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "rcp1",
  };
  razorpay.orders.create(options, function (err, order) {
    console.log(order);
    res.send({ orderId: order.id });
  });
});

router.post("/payment/verify", (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "G3Q4J9KXWuefR0bhohf8zKl1")
    .update(body.toString())
    .digest("hex");
  console.log("sig received", req.body.response.razorpay_signature);
  console.log("sig generated", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { signatureIsValid: "true" };
  res.send(response);
});

module.exports = router;
