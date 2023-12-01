const express = require("express");
const router = express.Router();
const auth = require("../../middlewere/auth");
const adminCollection = require("../../model/adminModel");
const PlaceOrder = require("../../model/orderPlaceModel");
const userCollection = require("../../model/userModel");
const Order = require("../../model/oraderModel");
const Product = require("../../model/productModel");

router.get("/", async (req, res) => {
  if (req.cookies.session) {
    const _id = req.adminId;
    const admin = await adminCollection.findOne({ _id });
    const orders = await PlaceOrder.find();
    let ordersArray = [];
    for (order of orders) {
      let user = await userCollection.findOne({ _id: order.userId });
      let userName = user.userName;
      order.userName = userName;
      ordersArray.push(order);
    }
    res.render("adminOrder", { admin, orders: ordersArray });
  } else {
    res.redirect("/admin");
  }
});

router.get("/:id", auth, async (req, res) => {
  if (req.cookies.session) {
    const id = req.params.id;

    try {
      const order = await PlaceOrder.findOne({ _id: id });
      const user = await userCollection.findOne({ _id: order.userId });
      const address = await Order.findOne({ _id: order.addressId });
      const orderItems = order.orderItems;
      let products = [];
      for (orderItem of orderItems) {
        let product = await Product.findOne({ _id: orderItem.productId });
        let qty = orderItem.quantity;
        products.push({ ...product.toObject(), qty })
      }
      console.log("user",user);
      console.log("order",order);
      console.log("address",address);
      console.log("products",products);
      if (order) {
        res.render("adminOrderSingle", { user, order, address, products });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.redirect();
  }
});

router.get("/update/:id", async (req, res) => {
  if (req.cookies.session) {
    const id = req.params.id;

    try {
      const order = await PlaceOrder.findOne({ _id: id });

      if (order) {
        return res.json(order);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.redirect("/admin");
  }
});

router.put("/update", async (req, res) => {
  const _id = req.body._id;
  const orderStatus = req.body.orderStatus;
  const orderUpdate = await PlaceOrder.findOneAndUpdate(
    { _id },
    { $set: { orderStatus } }
  );
  return res.json(orderUpdate);
});

router.get("/delete/:id", auth, async (req, res) => {
  if (req.cookies.session) {
    const orderId = req.params.id;

    try {
      const order = await PlaceOrder.findOne({ _id: orderId });

      if (order) {
        return res.json(order);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.redirect("/admin");
  }
});

router.delete("/delete", async (req, res) => {
  const orderId = req.body._id;
  const deleteOrder = await PlaceOrder.findByIdAndRemove(orderId);
  return res.json(deleteOrder);
});

module.exports = router;
