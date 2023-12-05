const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    email : {
        type:String,
        required : true
    },
    customerName : {
        type: String 
    },
    message : {
        type:String,
    }
   
})
const Contact = mongoose.model("Contact",contactSchema);

module.exports = Contact;  