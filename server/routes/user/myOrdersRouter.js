const express = require("express");
const router = express.Router();
const { authCart } = require("../../middlewere/user_auth");
const PlaceOrder = require("../../model/orderPlaceModel");
const Order = require("../../model/oraderModel");
const Product = require("../../model/productModel");
const { LogContext } = require("twilio/lib/rest/serverless/v1/service/environment/log");
const userCollection = require("../../model/userModel");

router.get("/",authCart,async(req,res)=>{
    
    try {
        const userId = req.userId;
        const user = await userCollection.findById(userId)
        const orderDatas = await PlaceOrder.find({userId});
        console.log(orderDatas);
        let orders = []
        for (orderData of orderDatas){
            let address = await Order.findOne({_id:orderData.addressId})

            orders.push({name:address.firstName,orderData})

        }
        console.log("orders : ",orders);

        return res.render("myOrders",{user,orders}) 
    } catch (error) {
        return res.render("error",{error})
    }
    
})

router.get("/:id",authCart,async (req,res)=>{
    const orderId = req.params.id;
    const order = await PlaceOrder.findOne({_id:orderId})
    const address = await Order.findOne({_id:order.addressId})
    const orderItems = order.orderItems;
    let orderedProducts = []
    for (orderItem of orderItems) {
        let product = await Product.findOne({_id:orderItem.productId})
        let qty = orderItem.quantity;
        orderedProducts.push({ ...product.toObject(), qty });
    }
    let orderPlaced = false;
    let shipped = false;
    let outOfDelivery = false;
    let delivered = false;
    let cancelled = false;
    if(order.orderStatus=="Order Placed"){
        orderPlaced = true
    }else if(order.orderStatus=="Shipped"){
        shipped = true
    }else if(order.orderStatus=="Out Of Delvery"){
        outOfDelivery = true
    }else if(order.orderStatus=="delivered"){
        delivered = true
    }else{
        cancelled = true
    }
    return res.render("myorderSingle",{order,address,orderedProducts,orderPlaced,delivered,cancelled,outOfDelivery,shipped})
})

router.get("/cancel/:id",async (req,res)=>{
    const orderId = req.params.id;
    const order  = await PlaceOrder.findOne({_id:orderId})
    return res.json(order);
})  

router.put("/cancel",async(req,res)=>{
    const {_id,reason} = req.body
    const cancel = await PlaceOrder.findOneAndUpdate({_id},{$set:{orderStatus:"cancelled",cancelReason:reason}})
    return res.json(cancel);
})

module.exports = router;