const express = require("express")
const adminCollection = require("../model/adminModel")
const route = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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


route.get("/",(req,res)=>res.render("index"))

route.get("/admin",(req,res)=>{
    res.render("adminlog")
})

route.post("/admin_login",async(req,res)=>{
    const { email,loginPassword } = req.body;

    try {
        const adminProfile = await adminCollection.findOne({ email });
        if (adminProfile && await bcrypt.compare(loginPassword, adminProfile.password)){
            const token = jwt.sign({ adminId: adminProfile._id }, 'your-secret-key', {
                expiresIn: '3h',
            });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error);
    }
})








module.exports = route