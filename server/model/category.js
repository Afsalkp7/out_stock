const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    description : {
        type: String 
    },
    createdAt : {
        type:Date,
        default:Date.now()
    }
    ,
    updatedAt : {
        type : Date,
    }
})
const Category = mongoose.model("Category",categorySchema);

module.exports = Category;  