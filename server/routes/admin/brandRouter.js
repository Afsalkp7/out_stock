const express = require("express")
const route = express.Router()

const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")
const Brand = require('../../model/brandsModel')
const multer = require('multer')
const storage = multer.diskStorage({
    destination : function (req,file,cb){
        return cb(null, "assets/img/uploads")
    },
    filename : function (req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    } 
});
const upload = multer({ storage:storage }) 

// const upload = require('../../../multer')
// const cloudinary = require("../../../cloudinary")
// const fs = require ("fs")
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


// route.use("/",upload.array("image",async (req,res)=>{
//   const uploader = async (path) => await cloudinary.uploads(path,"Images")

//   if (req.method === 'post'){
//     const urls = []
//     const files = req.files

//     for (const file of files){
//       const {path} = file

//       const newPath = await uploader.path

//       urls.push(newPath)

//       fs.unlinkSync(path)
//     }

//     return res.status(200).json({message : "image uploaded successfuly",data:urls})
//   }else{
//     return res.status(405).json({message : "not success"})
//   }
// }))

// route.post("/", upload.single('brandLogo'), async(req,res)=>{
  
// })
  
route.post("/",  upload.single('brandLogo'),async(req,res)=>{
    let brand = new Brand({
        brandName: req.body.brandName,
        description: req.body.description,
        logo :{
            data:req.file.filename,
            contentType:'image/jpg'
        }
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

route.put("/update",async (req,res)=>{
    const brand_id=req.body.brand_id;
    const brandUpdate = await Brand.findOneAndUpdate({_id:brand_id},{$set:req.body})
    return res.json(brandUpdate)
})

route.delete("/:id",async (req,res)=>{
    const brandId = req.params.id;
    const deleteBrand = await Brand.findByIdAndRemove(brandId);
    return res.json(deleteBrand)
})

module.exports = route