const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    additional:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    images : [{
        type : String
    }],
    brand:{
        type:String,
        default:""
    },
    color:{
        type:String,
        required:true
    },
    price:{
        type: Number,
        default:0
    },net_price:{
        type: Number,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }
    ,quantity:{
        type : Number,
        required:true,
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

exports.Product = mongoose.model("Product",productSchema);