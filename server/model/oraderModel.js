const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    firstName : {
        type:String,
    },
    lastName : {
        type: String 
    },
    email : {
        type : String
    },
    phone : {
        type : Number
    },
    address : {
        type : String
    },
    address2 : {
        type : String
    },
    country : {
        type : String
    },
    state : {
        type : String
    },
    pin : {
        type : Number
    }
})
const Order = mongoose.model("Order",orderSchema);

module.exports = Order;  