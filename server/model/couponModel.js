const mongoose = require("mongoose")

const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        required:true
    },
    couponProfit:{
        type:Number
    },
    couponType:{
        type:String
    },
    maxDis:{
        type:Number,
    },
    startDate: {
        type: Date,
    },
    endDate:{
        type:Date,
    }
})

const Coupon = mongoose.model("Coupon",couponSchema);

module.exports = Coupon;  