const express = require("express")
const route = express.Router()

 
const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")
const multer = require('multer')
const storage = multer.diskStorage({
    destination : function (req,file,cb){
        return cb(null, "assets/img/logo")
    },
    filename : function (req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    } 
});
const upload = multer({ storage:storage })
route.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        res.render("adminBrand",{admin})
    }else{
        res.redirect("/admin")
    }
})

route.post("/", upload.single('brandLogo'), async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/admin/brands")
})

module.exports = route