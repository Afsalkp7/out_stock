const express = require("express")
const route = express.Router()
const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")
const Product = require("../../model/productModel")
const Category = require("../../model/category")
const Brand = require("../../model/brandsModel")
const multer = require('multer')
const storage = multer.diskStorage({
    destination : function (req,file,cb){
        return cb(null, "assets/img/products")
    },
    filename : function (req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    } 
});
const uploadProducts = multer({ storage:storage })


route.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        const products = await Product.find();
        res.render("adminProduct",{admin,products})
    }else{
        res.redirect("/admin")
    }
})

route.post("/",uploadProducts.single("image") , async(req,res)=>{

    const category = await Category.findOne({name : req.body.category})
    const brand = await Brand.findOne({brandName : req.body.brand})
    if(!category){
        return res.render('adminProduct',{alert : true});
    }else if(!brand){
        return res.render('adminProduct',{alertBrand : true});
    }
    else{
        let products = new Product({
            productName : req.body.productName,
            image : {
                data : req.file.filename,
                contentType :'image/jpg'
            },
            price : req.body.price,
            netPrice : req.body.netPrice,
            category : req.body.category,
            brand : req.body.brand,
            quantity : req.body.quantity,
            description : req.body.description,
            additional : req.body.additional,
        })
    
        product = await products.save();
        if(!product){
            return res.render(404,"error");
        }else{
           return res.redirect("/admin/products")
        }
    }
    
})

route.get("/:id",async (req,res)=>{
    if(req.cookies.session){
    const productId = req.params.id;
    try {
        const product = await Product.findOne({ _id: productId });
        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }else{
        return res.redirect("/admin")
    }
})

route.get("/update/:id", async (req,res)=>{
    if(req.cookies.session){
    const productId = req.params.id;
  
    try {
      const product = await Product.findOne({ _id: productId });
      
      if (product) {
        return res.json(product);
      } else {
        res.status(404).json({ error: 'product not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}else{
    return res.redirect("/admin")
}
})

route.put("/update",async (req,res)=>{
    const productId=req.body.product_id;
    const productUpdate = await Product.findOneAndUpdate({_id:productId},{$set:req.body})
    return res.json(productUpdate)
})

route.delete("/:id",async (req,res)=>{
    const productId = req.params.id;
    const deleteProduct = await Product.findByIdAndRemove(productId);
    return res.json(deleteProduct)
})

module.exports = route