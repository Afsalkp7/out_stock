const express = require("express");
const route = express.Router();
const userCollection = require("../../model/userModel");
const adminCollection = require("../../model/adminModel");
const auth = require("../../middlewere/auth");
const PlaceOrder = require("../../model/orderPlaceModel");
const Order = require("../../model/oraderModel")

route.get("/", auth, async (req, res) => {
  if (req.cookies.session) {
    const _id = req.adminId;
    const admin = await adminCollection.findOne({ _id });
    const users = await userCollection.find()
    res.render("admin_user", { admin, users });
  } else {
    res.redirect("/admin");
  }
});

route.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userCollection.findOne({ _id: userId });
    const orderDatas = await PlaceOrder.find({userId:user._id})
    let orders = []
        for (orderData of orderDatas){
            let address = await Order.findOne({_id:orderData.addressId})

            orders.push({name:address.firstName,orderData})

        }
    if (user) {
      res.render("adminSingleUser",{user,orders});
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/update/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userCollection.findOne({ _id: userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.put("/update/:userId", async (req, res) => {
  const userId = req.params.userId;
  const status = req.body.status;
  const updatedStatus = await userCollection.updateOne(
    { _id: userId },
    { $set: { status } }
  );
  if (updatedStatus) {
    res.redirect(303, "/admin/users/");
  }
});

route.get("/delete/:id", async (req,res)=>{
  if(req.cookies.session){
    const userId = req.params.id;
  
    try {
      const user = await userCollection.findOne({ _id: userId });
      
      if (user) {
        return res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }else{
    return res.redirect("/admin")
  }
})

route.delete("/delete", async (req, res) => {
  const userId = req.body.user_id;
  await Order.deleteMany({ userId });
  await Cart.deleteMany({ userId });
  await WishItem.deleteMany({ userId });
  await PlaceOrder.deleteMany({ userId });
  const deleteUser = await userCollection.findOneAndRemove({ _id: userId });
  return res.json(deleteUser)
});

module.exports = route;
