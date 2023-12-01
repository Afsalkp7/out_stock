const mongoose = require("mongoose")
const fns = require("date-fns")
const bannerSchema = mongoose.Schema({
    bannerName:{
        type:String,
        required:true
    },
    bannerImage:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    expirationDate: {
        type: Date,
        default: function () {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            return currentDate;
        }
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String
    },
    place:{
        type : String
    },
})

const Banner = mongoose.model("Banner",bannerSchema);

module.exports = Banner;  