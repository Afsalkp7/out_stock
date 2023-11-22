const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const PlaceOrder = require("../../model/orderPlaceModel")
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel")
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");


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
      const address = await Order.findById(orderData.addressId)
      const orderedItems = orderData.orderItems
      console.log("jn ",orderedItems);
      let orders =[]
      let sum = 0
      for (let ordereditem of orderedItems){
        const productId = ordereditem.productId;
        const qty = ordereditem.quantity
        
        const productData = await Product.findById(productId)
        let newQty = productData.quantity - qty;
        await Product.updateOne({_id:productId},{$set:{quantity:newQty}})
        sum = sum +(productData.price * qty)
        orders.push({productData,qty})

      }
        return res.render("orderSummery",{ordered : true,address,orderData,orders,sum})
    }
    

})










module.exports = router;