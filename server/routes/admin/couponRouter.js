const express = require("express")
const router = express.Router();
const Coupon = require("../../model/couponModel")
const auth = require("../../middlewere/auth")


router.get("/",auth,async (req,res)=>{
    const coupons = await Coupon.find()
    res.render("adminCoupon",{coupons})
})

router.get("/:id",async (req,res) => {
    const couponId = req.params.id;
    const coupon = await Coupon.findById(couponId)
    res.render("adminCouponSingle",{coupon})
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

router.put("/update",async(req,res)=>{
    console.log(req.body);
    const couponId = req.body.id;
    const { updateCouponCode,updateCouponType,updateCouponProfit,updateMaxDis,updateStartDate,updateEndDate } = req.body;
    const coupon = await Coupon.updateOne({_id:couponId},{$set:{
        couponCode:updateCouponCode,
        couponProfit:updateCouponProfit,
        couponType:updateCouponType,
        maxDis:updateMaxDis,
        startDate:updateStartDate,
        endDate:updateEndDate,
    }})
    res.json(coupon)
})

module.exports = router