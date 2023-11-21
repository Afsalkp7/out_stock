const express = require("express");
const router = express.Router();
const { authCart } = require("../../middlewere/user_auth");

router.get("/",authCart,async(req,res)=>{
    return res.render("orderSummery")
})

module.exports = router;