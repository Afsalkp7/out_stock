const express = require("express")
const route = express.Router()
const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")
const PlaceOrder = require("../../model/orderPlaceModel")
const { order } = require("paypal-rest-sdk")


const isSameDay = (date1,date2) => {
    const day1 = new Date(date1);
    const day2 = new Date(date2);
    return (
        day1.getUTCFullYear() === day2.getUTCFullYear()&&
        day1.getUTCMonth() === day2.getUTCMonth()&&
        day1.getUTCDate() === day2.getUTCDate()
    )
}


route.get("/", auth , async (req,res) => {
    const _id = req.adminId;
    const admin = await adminCollection.findOne({ _id });

    //
    const orders = await PlaceOrder.aggregate([
        {
            $group:{
                _id:'$orderStatus',
                count:{$sum:1}
            }
        }
    ])
    let totalOrders=0;
    let delivered;
    let cancelled;
    let pendingOrders = 0;
    for (ord of orders) {
        totalOrders+=ord.count;
        if (ord._id=="Delivered"){
            delivered = ord.count
        }else if(ord._id=="cancelled"){
            cancelled = ord.count
        }else{
            pendingOrders+=ord.count
        }
    }
    const orderCount = {delivered,cancelled,totalOrders,pendingOrders}
    //
    const lastWeekOrders = await PlaceOrder.aggregate([
        {
            $match : {
                $expr : {
                    $gt: [
                        "$orderedDate",
                        {$dateSubtract:{
                            startDate:"$$NOW",
                            unit:"day",
                            amount:7
                        }}
                    ]
                }
            }
        }
    ])
    const weekOrdersAmount = []
    for (i=0 ; i<7 ; i++) {
        var targetDate =  new Date();
        targetDate.setDate(targetDate.getDate() - i);
        var filteredData = lastWeekOrders.filter((obj)=> isSameDay(obj.orderedDate,targetDate))
        var grandTotalSum = 0;
        for (j=0 ; j<filteredData.length;j++) {
            grandTotalSum+=filteredData[j].totalAmount
        }
        weekOrdersAmount.push(grandTotalSum)
    }
    
    //

    const lastMonthOrders = await PlaceOrder.aggregate([
        {
            $match : {
                $expr : {
                    $gt: [
                        "$orderedDate",
                        {$dateSubtract:{
                            startDate:"$$NOW",
                            unit:"month",
                            amount:12    
                        }}
                    ]
                }
            }
        }
    ])

    const YearOrdersAmount = []
    for (i=0 ; i<12 ; i++) {
        var targetMonth =  i;
        
        var filteredData = lastMonthOrders.filter((obj)=> {
            return obj.orderedDate.getMonth() === targetMonth;
        })
        var grandTotalSum = 0;
        for (j=0 ; j<filteredData.length;j++) {
            grandTotalSum+=filteredData[j].totalAmount
        }
        YearOrdersAmount.push(grandTotalSum)
    }
    console.log(YearOrdersAmount);


    res.render("adminReport", {admin,orderCount,weekOrdersAmount,YearOrdersAmount} )
})






module.exports = route