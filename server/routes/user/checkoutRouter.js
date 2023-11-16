const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel")
const { authCart } = require("../../middlewere/user_auth");

router.get("/",(req,res)=>{
    res.render("checkout")
})

module.exports = router;