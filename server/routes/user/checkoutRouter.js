const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel")
const { authCart } = require("../../middlewere/user_auth");

router.post("/",authCart,async(req,res)=>{
    const userId = req.userId;
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
    res.render("checkout",{grandTotal,cartProducts})
})

module.exports = router;