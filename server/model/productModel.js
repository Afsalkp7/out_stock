const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName:{
        type:String,
    },
    description:{
        type : String,
    },
    additional:{
        type:String,
        default:""
    },
    image:{
        type:Object,
        default:""
    },
    images : [String],
    brand:{
        type:String,
        default:""
    },
    color:{
        type:String,
    },
    price:{
        type: Number,
        default:0
    },net_price:{
        type: Number,
        default:0
    },
    category:{
        type:String,
        ref:"Category",
    }
    ,quantity:{
        type : Number,
        min:0,
        max:255
    },
    rating:{
        type:Number,
        default:0
    },
    reviews:{
        type:Number,
        default:0
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
})
const Product = mongoose.model("Product",productSchema);

module.exports = Product;  
