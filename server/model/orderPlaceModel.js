const mongoose = require("mongoose");

const placeOrderSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    addressId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order'
    },
    totalAmount : {
        type : Number
    },
    paymentId : {
        type : String
    },
    orderStatus : {
        type : String
    },
    orderItems : {
        type : Array
    },
    orderedDate : {
        type : Date,
        default : Date.now
    },
    deliveryDate : {
        type : Date,
        default :  function () {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            return currentDate;
        }
    }
})
const PlaceOrder = mongoose.model("PlaceOrder",placeOrderSchema);

module.exports = PlaceOrder;  