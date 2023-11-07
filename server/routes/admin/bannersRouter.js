const express = require("express")
const router = express.Router();
const adminCollection = require("../../model/adminModel")
const auth = require("../../middlewere/auth")
const multer = require('multer')
const upload = multer({ dest: 'assets/img/Banners' })
const cloudinary = require("../../../cloudinary") 
const Banner = require("../../model/bannerModel")


router.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        const banners = await Banner.find()
        res.render("adminBanners",{admin,banners})
    }else{
        res.redirect("/admin")
    }
})

router.post("/",  upload.single('bannerImage'),async(req,res)=>{
    const { bannerName,description,croppedImage,place,status } = req.body;
    const result = await cloudinary.uploader.upload(croppedImage);
    console.log('Cloudinary result:', result);
      let banner = new Banner({
          bannerName,
          description,
          place,
          status,
          bannerImage : result.url,
      })
  
      banner = await banner.save();
      if(!banner){
          return res.render(404,"error");
      }else{
         return res.redirect("/admin/banners")
      }
  })

  router.get("/:id",auth, async (req,res)=>{
    if(req.cookies.session){
      const id = req.params.id;
  
      try {
          const banner = await Banner.findOne({ _id: id });
          if (banner) {
            res.json(banner);
          } else {
            res.status(404).json({ error: 'Banner not found' });
          }
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }else{
        return res.redirect("/admin")
      }
  })
  

  router.get("/update/:id",auth,async (req,res)=>{
    if(req.cookies.session){
      const bannerId = req.params.id;
    
      try {
        const banner = await Banner.findOne({ _id: bannerId });
        
        if (banner) {
          return res.json(banner);
        } else {
          res.status(404).json({ error: 'banner not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }else{
      return res.redirect("/admin/banners")
    }
  })


  router.put("/update",async (req,res)=>{
    const bannerId=req.body.banner_id;
    const bannerUpdate = await Banner.findOneAndUpdate({_id:bannerId},{$set:req.body})
    return res.json(bannerUpdate)
})

router.get("/delete/:id",auth,async (req,res)=>{
    if(req.cookies.session){
      const bannerId = req.params.id;
    
      try {
        const banner = await Banner.findOne({ _id: bannerId });
        
        if (banner) {
          return res.json(banner);
        } else {
          res.status(404).json({ error: 'banner not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }else{
      return res.redirect("/admin/banners")
    }
  })


  
router.delete("/delete",async(req,res)=>{
    const bannerId= req.body.banner_id;
    console.log((bannerId));
    const deleteBanner = await Banner.findByIdAndRemove(bannerId);
    return res.json(deleteBanner)
  })

module.exports = router