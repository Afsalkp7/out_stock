const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const Category = require("../../model/category")
const Brand = require("../../model/brandsModel")

router.get("/",async(req,res)=>{
    const products = await Product.find()
    const category = await Category.find()
    const brands = await Brand.find()
    res.render("shop",{products,category,brands})
})

router.get("/:id",async(req,res)=>{
    const _id = await req.params.id;
    const item = await Product.findById(_id);
    res.render("product",{item})
})
module.exports = router;