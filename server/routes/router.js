const express = require("express")
const adminCollection = require("../model/adminModel")
const route = express.Router()

    
route.get("/",(req,res)=>res.render("index"))

route.get("/admin",(req,res)=>{
    
})


// route.get("/admin",(req,res)=>{
//     res.render('adminSignup')
// })

// route.post("/Admin_login",async(req,res)=>{
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



module.exports = route