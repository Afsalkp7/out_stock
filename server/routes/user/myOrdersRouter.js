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
    return res.render("myorderSingle",{order,address,orderedProducts})
})

module.exports = router;