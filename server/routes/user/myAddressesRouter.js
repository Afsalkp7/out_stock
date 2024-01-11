const express = require("express");
const router = express.Router();
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");

router.get("/", authCart, async (req, res) => {
  const userId = req.userId;
  const myAddress = await Order.find({ userId });
  console.log(myAddress);
  return res.render("userAddress", { myAddress });
});

router.post("/", authCart, async (req, res) => {
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
  } = req.body;
  if (id) {
    const existAdress = await Order.findOne({ _id: id });
    if (existAdress) {
      const updateAddress = await Order.updateOne(
        { _id: id },
        { $set: req.body }
      );
      if (updateAddress) {
        return res.redirect("/myAddresses");
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
    return res.redirect("/myAddresses");
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
  const orders = await PlaceOrder.find({addressId})
  if(orders.length>0){
    const deleteOreders = await PlaceOrder.deleteMany({addressId})
  }
  const deleteAddress = await Order.findByIdAndRemove(addressId);
  return res.json(deleteAddress);
});

module.exports = router;
