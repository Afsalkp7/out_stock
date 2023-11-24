const mongoose = require("mongoose");
const fns = require('date-fns')

const categorySchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    description : {
        type: String 
    },
    createdAt : {
        type:String,
        default:fns.format(new Date(),'dd-MM-yyyy')
    }
    ,
    updatedAt : {
        type : Date,
    }
})
const Category = mongoose.model("Category",categorySchema);

module.exports = Category;  