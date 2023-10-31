const mongoose = require("mongoose")

const brandSchema = mongoose.Schema({
    brandName:{
        type:String,
        required:true
    },
    logo:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    description:{
        type:String,
        required:true
    },
    updateAt:{
        type:Date
    }
})

const Brand = mongoose.model("Brand",brandSchema);

module.exports = Brand;  