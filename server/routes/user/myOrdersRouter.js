const express = require("express");
const router = express.Router();
const { authCart } = require("../../middlewere/user_auth");
const PlaceOrder = require("../../model/orderPlaceModel");
const Order = require("../../model/oraderModel");
const Product = require("../../model/productModel");
const { LogContext } = require("twilio/lib/rest/serverless/v1/service/environment/log");

router.get("/",authCart,async(req,res)=>{
    
    try {
        const userId = req.userId;
        const orderDatas = await PlaceOrder.find({userId})
        console.log(orderDatas);
        let orderSummery = []
        for (orderData of orderDatas) {
            let address = await Order.findOne({_id:orderData.addressId})
            console.log(address);
            let totalAmount =orderData.totalAmount;
            let paymentId = orderData.paymentId;
            let orderStatus = orderData.orderStatus
            let orderItems = orderData.orderItems;
            for (orderItem of orderItems){
                let product = await Product.findOne({_id:orderItem.productId})
                let qty = orderItem.quantity
                orderSummery.push({address:address,totalAmount:totalAmount,paymentId:paymentId,orderStatus:orderStatus,product:product,qty:qty})
            }

        }
        console.log(orderSummery);


        return res.render("myOrders",{orderSummery}) 
    } catch (error) {
        return res.render("error",{error})
    }
    
})

module.exports = router;