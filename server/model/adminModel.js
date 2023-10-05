const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const adminSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    cpassword : {
        type : String,
        required : true
    }
})

adminSchema.pre("save", async function (next){
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.password, 10);
    next();
})
const adminCollection = new mongoose.model("adminCollection",adminSchema)

module.exports = adminCollection;  