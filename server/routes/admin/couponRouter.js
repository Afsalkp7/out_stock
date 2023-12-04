const express = require("express")
const router = express.Router();
const Coupon = require("../../model/couponModel")
const auth = require("../../middlewere/auth")


router.get("/",auth,async (req,res)=>{
    const coupons = await Coupon.find()
    res.render("adminCoupon",{coupons})
})

router.post("/",async (req,res)=>{
    console.log(req.body);
    const { couponCode,couponType,couponProfit,maxDis,startDate,endDate } = req.body;
    let coupon = new Coupon({
        couponCode,
        couponProfit,
        couponType,
        maxDis,
        startDate,
        endDate,
    })

    coupon = await coupon.save();
    if(!coupon){
        return res.render(404,"error");
    }else{
       return res.redirect("/admin/coupons")
    }
})

module.exports = router