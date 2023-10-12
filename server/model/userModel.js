const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
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
    status : {
        type : String,
        required : true
    }
})

userSchema.pre("save", async function (next){
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.password, 10);
    next();
})
const userCollection = new mongoose.model("userCollection",userSchema)

module.exports = userCollection;  