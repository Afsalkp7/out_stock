const express = require("express")
const route = express.Router()
const adminCollection = require("../../model/adminModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKey
const auth = require("../../middlewere/auth")
const session = require('express-session');
const { token } = require("morgan");



// route.get("/admin",(req,res)=>{
//     res.render('adminSignup')
// })
// route.post("/admin_login",async(req,res)=>{
//     try {
//         const {password,cpassword} = req.body
//         if(password === cpassword){
//             const outstockAdminData = new adminCollection({
//                 userName : req.body.name,
//                 email : req.body.email,
//                 phone : req.body.phone,
//                 password : req.body.password,
//                 cpassword : req.body.cpassword
//             })
//             const adminData = await outstockAdminData.save()
//             res.render("adminLog")
//         }else{
//             res.render("adminSignup")
//         }
//     } catch (error) {
//         res.send(error)
//     } 
// })

route.get("/",(req,res)=>{
    const token = req.cookies.session
    if(token){
        res.redirect("/admin/index")
    }else
        res.render("adminlog")
})

route.get("/index",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        res.render("dashboard",{admin})
    }else{
        res.redirect("/admin")
    }
})

route.post("/admin_login",async(req,res)=>{
    const { email,loginPassword } = req.body;
    try {
        const adminProfile = await adminCollection.findOne({ email });
        if (adminProfile && await bcrypt.compare(loginPassword, adminProfile.password)){
            const token = jwt.sign({ adminId: adminProfile._id }, secretKey);
            // req.session.adminId = adminProfile._id;
            res.cookie("session",token)  
            return res.redirect("/admin")
        } else {
            res.render("adminlog",{emailMatch : true})
        }
    } catch (error) {
        console.log(error);
    }
})

route.get("/products",auth,(req,res)=>{
    res.render("product")
})

route.put("/update",auth,async (req,res)=>{
    const admin_id = req.body._id
    console.log(admin_id);
    const updatedData  = await adminCollection.updateOne({ _id: admin_id }, { $set: req.body });
    // console.log(updatedData);
    res.cookie("editse",updatedData)
    res.json(updatedData)
})


route.get("/logout",(req,res)=>{
    if(req.cookies.session){
        res.clearCookie('session')
        res.redirect("/admin")
    }else{
        res.render("adminlog")
        }

    })

module.exports = route