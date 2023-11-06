const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")


router.get("/",async(req,res)=>{
    const products = await Product.find()
    res.render("shop",{products})
})

router.get("/:id",async(req,res)=>{
    const _id = await req.params.id;
    const item = await Product.findById(_id);
    res.render("product")
})
module.exports = router;