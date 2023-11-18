const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel")
const { authCart } = require("../../middlewere/user_auth");
const Order = require("../../model/oraderModel");

router.post("/",authCart,async(req,res)=>{
    const userId = req.userId;
    const orderAddress =  await Order.find({userId})
    const cartItems = await CartItem.find({userId})
    const cartProducts = [];

    for (let cartItem of cartItems){
        const productId = cartItem.productId;
        const quantity = cartItem.quantity;

        const cartContent = await Product.find({_id:productId})
        if (cartContent){
            cartProducts.push({cartContent,quantity})
        }
    }
    const grandTotal = req.body.grandToCheck
    res.render("checkout",{grandTotal,cartProducts,orderAddress})
})

router.post("/order",authCart,async(req,res)=>{
    const userId = req.userId;
    const {firstName,lastName,email,phone,address,address2,country,state,pin} = req.body
    const checkOutData = new Order({
        userId,firstName,lastName,email,phone,address,address2,country,state,pin
    })
    await checkOutData.save();
    res.render("payment")
})

module.exports = router;