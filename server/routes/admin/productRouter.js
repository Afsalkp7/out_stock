const express = require("express")
const route = express.Router()
const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")

route.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        res.render("adminProduct",{admin})
    }else{
        res.redirect("/admin")
    }
})

module.exports = route