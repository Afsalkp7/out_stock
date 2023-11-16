const express = require("express")
const route = express.Router()

const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")
const Brand = require('../../model/brandsModel')
const multer = require('multer')
const upload = multer({ dest: 'assets/img/Brands' })
const cloudinary = require("../../../cloudinary") 
const path = require("path")

route.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        const brands = await Brand.find()
        res.render("adminBrand",{admin,brands})
    }else{
        res.redirect("/admin")
    }
})

route.post("/",upload.single('brandLogo'),async(req,res)=>{
  const { brandName,description,croppedImage } = req.body;
  const result = await cloudinary.uploader.upload(croppedImage);
  console.log('Cloudinary result:', result);
    let brand = new Brand({
        brandName,
        description,
        logo : result.url,
    })

    brand = await brand.save();
    if(!brand){
        return res.render(404,"error");
    }else{
       return res.redirect("/admin/brands")
    }
})



route.get("/:id",auth, async (req,res)=>{
  if(req.cookies.session){
    const id = req.params.id;

    try {
        const brand = await Brand.findOne({ _id: id });
        if (brand) {
          res.json(brand);
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

route.get("/update/:id",auth,async (req,res)=>{
  if(req.cookies.session){
    const brandId = req.params.id;
  
    try {
      const brand = await Brand.findOne({ _id: brandId });
      
      if (brand) {
        return res.json(brand);
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

route.put("/update",upload.single('brandLogo'),async (req,res)=>{
    const brand_id=req.body.brand_id; 
    const result = req.file ? await cloudinary.uploader.upload(req.file.path):null;
    try {
      const brandUpdate = await Brand.findOneAndUpdate({ _id: brand_id }, { $set: {
        brandName:req.body.brandName,
        description:req.body.description,
        ...(req.file && { logo: result.url }),
      } });
      return res.json(brandUpdate);
  } catch (error) {
      console.error('Error updating brand:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
})
route.get("/delete/:id",auth,async (req,res)=>{
  if(req.cookies.session){
    const brandId = req.params.id;
  
    try {
      const brand = await Brand.findOne({ _id: brandId });
      
      if (brand) {
        return res.json(brand);
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
// route.get("/delete/confirm/:id",async (req,res)=>{
//     const brandId = req.params.id;
//     const deleteBrand = await Brand.findByIdAndRemove(brandId);
//     return res.json(deleteBrand)
// })

route.delete("/delete",async(req,res)=>{
  const brand_id= req.body.brand_id;
  console.log((brand_id));
  const deleteBrand = await Brand.findByIdAndRemove(brand_id);
  return res.json(deleteBrand)
})


module.exports = route