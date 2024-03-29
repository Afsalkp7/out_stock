const express = require("express")
const route = express.Router()
const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")
const Product = require("../../model/productModel")
const Category = require("../../model/category")
const Brand = require("../../model/brandsModel")
const multer = require('multer')
const upload = multer({ dest: 'assets/img/products' })
const cloudinary = require("../../../cloudinary") 


route.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        const products = await Product.find();
        const brands = await Brand.find();
        const categories = await Category.find()
        res.render("adminProduct",{admin,products:products.reverse(),brands,categories})
    }else{
        res.redirect("/admin")
    }
})


route.post("/", upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'secondImage', maxCount: 1 }, { name: 'thirdImage', maxCount: 1 }, { name: 'fourthImage', maxCount: 1 }]),async(req,res)=>{
  try {
    const { productName, price, net_price, category, brand, quantity, description, additional,croppedImage,croppedSecondImage,croppedThirdImage,croppedFourthImage } = req.body;
  const mainImage = await cloudinary.uploader.upload(croppedImage);
  const secondImage  = croppedSecondImage ? await cloudinary.uploader.upload(croppedSecondImage):null;
  const thirdImage  = croppedThirdImage ? await cloudinary.uploader.upload(croppedThirdImage):null;
  const fourthImage  = croppedFourthImage ? await cloudinary.uploader.upload(croppedFourthImage):null;
  console.log('Cloudinary result:', mainImage,secondImage,thirdImage,fourthImage);
  const products = new Product({
        productName,
        price,
        net_price,
        category,
        brand,
        quantity,
        description,
        additional,
        image: mainImage.url,
        ...(secondImage && { secondImage: secondImage.url }),
        ...(thirdImage && { thirdImage: thirdImage.url }),
        ...(fourthImage && { fourthImage: fourthImage.url })
      });
    
    const added =  await products.save();
  if(!added){
                return res.render(404,"error");
            }else{
               return res.redirect("/admin/products")
            }

  } catch (error) {
    return res.send(error)
  }
});


// route.post('/', upload.array('image',5), async (req, res) => {
//   const { productName, price, net_price, category, brand, quantity, description, additional } = req.body;
//   const imageUrls = req.files.map((file) => file.path);
//   const cloudinaryImageUrls = [];
//   for (const imagePath of imageUrls) {
//     const result = await cloudinary.uploader.upload(imagePath);
//     cloudinaryImageUrls.push(result.secure_url);
//   }
//   const products = new Product({
//     productName,
//     price,
//     net_price,
//     category,
//     brand,
//     quantity,
//     description,
//     additional,
//     images: cloudinaryImageUrls,
//   });

//   await products.save();

//   if(!products){
//                 return res.render(404,"error");
//             }else{
//                return res.redirect("/admin/products")
//             }
// });







route.get("/:id",async (req,res)=>{
    if(req.cookies.session){
    const productId = req.params.id;
    try {
        const product = await Product.findOne({ _id: productId });
        if (product) {
          return res.json(product);
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
    console.log(productUpdate);
    return res.json(productUpdate)
})

route.get("/delete/:id",auth,async(req,res)=>{
        if(req.cookies.session){
          const proId = req.params.id;
        
          try {
            const product = await Product.findOne({ _id: proId });
            
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


route.delete("/delete",async (req,res)=>{
    const productId = req.body.pro_id;
    const deleteProduct = await Product.findByIdAndRemove(productId);
    return res.json(deleteProduct)
})

module.exports = route