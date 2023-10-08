const express = require("express")
const router = express.Router()

router.get("/",(req,res)=>{
    //  const token = req.cookies.userSession
    //  if(token){
        res.render("index")
    //  }else{
    //     res.render("userlogin")
    //  }
    })





module.exports = router;