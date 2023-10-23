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

router.post("/user_login",urlencodedParser,[
    check("email","Email is not valid")
        .exists()
        .isEmail()
        .normalizeEmail(),  
    check("password","password must need alphanumeic,regex,and 8 character")
        .exists()
        .isLength({ min : 8 , max : 25 })
        .isAlphanumeric()
], async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const errorArray = errors.array()
        const alert = errorArray[0] 
        console.log(alert);
        return res.render("userlogin",{alert : alert})
    }
    const { email,password } = req.body;
    
        try {
            const userProfile = await userCollection.findOne({ email });
            if(userProfile.status == "active"){
                if (userProfile && await bcrypt.compare(password, userProfile.password)){
    
                const token = jwt.sign({ userId: userProfile._id }, secretKey);
                res.cookie("usersession",token)
                return res.redirect("/")
            } else {
                res.render("userlogin",{valid:true})
            }
            }else{
                res.render("userlogin",{blocked:true})
            }
            
        } catch (error) {
            console.log(error);
        }
    
    
})

router.put("/update",auth,async(req,res)=>{
    const user_id = req.body._id
    console.log((user_id));
    const updatedData  = await userCollection.updateOne({ _id: user_id }, { $set: req.body });
    res.json({updatedData})
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

router.put("/change_password",auth,async(req,res)=>{
    try {
                const userId = req.body._id;
                const currentPassword = req.body.oldPass;
                const newPassword = req.body.newPass;
                const confirmPassword = req.body.rePass;
        
                const user = await userCollection.findById(userId);
                console.log(user);
                if (!user) {
                  return res.status(404).json({message:"User not found."});
                }
                const curPasswordMatch = await bcrypt.compare(currentPassword, user.password);
                        if (!curPasswordMatch) {
                            return res.status(401).send("Current password is incorrect.");
                        }
                if (newPassword !== confirmPassword) {
                                return res.status(400).send("New passwords do not match.");
                            }
        
                const newPasswordMatch = await bcrypt.compare(currentPassword, user.password);
                if (!newPasswordMatch) {
                    return res.status(401).send("Current password is incorrect.");
                }
     
                const newPasswordHash = await bcrypt.hash(newPassword, 10);
                user.password = newPasswordHash;
                await user.save();
                console.log(user);

                res.clearCookie('usersession');
                res.redirect("/");
            } catch (error) {
                console.log(error);
                res.send("error identified...")
            }
})

module.exports = router;