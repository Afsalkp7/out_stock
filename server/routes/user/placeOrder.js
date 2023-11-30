const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel");
const PlaceOrder = require("../../model/orderPlaceModel");
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel");
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");
const Razorpay = require("razorpay");

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

router.post("/", authCart, async (req, res) => {
  const userId = req.userId;
  const { orderId, paymentMethod, grandTotal } = req.body;
  const cartItems = await CartItem.find({ userId });
  const orderedProducts = [];
  for (let cartItem of cartItems) {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;
    orderedProducts.push({ productId, quantity });
  }
  console.log(orderedProducts);
  if (paymentMethod == "cash on delivery") {
    try {
      const orderData = new PlaceOrder({
        userId,
        addressId: orderId,
        totalAmount: grandTotal,
        paymentId: paymentMethod,
        orderStatus: "Order Placed",
        orderItems: orderedProducts,
      });
      await orderData.save();
      const deleteCart = await CartItem.deleteMany({ userId });
      if (deleteCart) {
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

        return res.render("orderSummery", {
          ordered: true,
          address,
          orderData,
          orders,
          sum,
        });
      }
    } catch (error) {
      res.render("error", { error });
    }
  }
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
