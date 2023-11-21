const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const PlaceOrder = require("../../model/orderPlaceModel")
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel")
const { authCart } = require("../../middlewere/user_auth");



router.post("/",authCart,async (req,res)=>{
    const userId = req.userId;
    const { orderId,paymentMethod,grandTotal } = req.body;
    const cartItems = await CartItem.find({ userId });
    const orderedProducts = [];
    for (let cartItem of cartItems) {
      const productId = cartItem.productId;
      const quantity = cartItem.quantity;
      orderedProducts.push({productId,quantity}) 
    }
    console.log(orderedProducts);
    if ( paymentMethod != "cash on delivery" ) {
        return res.send("only cash on delevery available")
    }

    const orderData = new PlaceOrder({
        userId,
        addressId:orderId,
        totalAmount:grandTotal,
        paymentId:paymentMethod,
        orderStatus:"Order Placed",
        orderItems:orderedProducts,
      });
    await orderData.save();
      
    const deleteCart = await CartItem.deleteMany({ userId });
    if(deleteCart){
        return res.redirect("/orderSummery")
    }
    

})










module.exports = router;