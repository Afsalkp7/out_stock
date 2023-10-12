const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKey
const userCollection = require("../../model/userModel")
const auth = require("../../middlewere/user_auth")
const bcrypt = require('bcrypt');
const {check,validationResult} = require("express-validator");
const { token } = require("morgan");
const session = require('express-session');
const urlencodedParser = bodyParser.urlencoded({ extended:false })

router.get("/",(req,res)=>res.render("index"))

router.get("/user",(req,res)=>{
    const token = req.cookies.usersession;
    if(token){
        res.redirect("/user_data")
    }else{
        res.render("userlogin")
    }
})
router.get("/registration",(req,res)=>{
    res.render("userregister")
})
router.post("/register",urlencodedParser,[
    check('userName',"User name must be 3 characters")
        .exists()
        .isLength({ min:3 }),
    check("email","Email is not valid")
        .exists()
        .isEmail()
        .normalizeEmail(),
    check("phone","entered phone number is not valid")
        .exists()
        .isLength({ min:10 , max:10 })
        .isMobilePhone()
        .isNumeric(),
    check("password","password must need alphanumeic,regex,and 8 character")
        .exists()
        .isLength({ min : 8 , max : 25 })
        .isAlphanumeric()
], async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const errorArray = errors.array()
        const alert = errorArray[0] 
        console.log(alert);
        return res.render("userregister",{alert : alert})
    }
    try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if( password === cpassword){
        const userData = new userCollection({
            userName : req.body.userName,
            email : req.body.email,
            phone : req.body.phone,
            password : req.body.password,
            cpassword : req.body.cpassword,
            status : req.body.status
        })
        const postData = await userData.save()
        res.render("userlogin")
    }
    else{
        res.render("userregister",{notMatch : true})
    }
    } catch (error) {
        res.send(error);
    }
})

router.get("/user_data",auth,async(req,res)=>{
    const token = req.cookies.usersession;
    if(token){
        const _id = req.userId
        console.log(_id);
        const user = await userCollection.findOne({ _id })
        
        res.render("user_details",{user})
    }else{
        res.render("userlogin",{notfound:true})
    }
})

router.post("/user_login",async(req,res)=>{
    const { email,password } = req.body;
    try {
        const userProfile = await userCollection.findOne({ email });
        if (userProfile && await bcrypt.compare(password, userProfile.password)){

            const token = jwt.sign({ userId: userProfile._id }, secretKey);
            res.cookie("usersession",token)
            return res.redirect("/user")
        } else {
            res.render("userlogin")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/update",auth,async(req,res)=>{
    const user_id = req.body._id
    console.log((user_id));
    const updatedData  = await userCollection.updateOne({ _id: user_id }, { $set: req.body });
    res.json({message:"ok"})
})

router.get("/logout",(req,res)=>{
    const token = req.cookies.usersession
    if(token){
        res.clearCookie('usersession');
        res.render("index")
    }else{
        res.render("userlogin")
    }
})


module.exports = router;