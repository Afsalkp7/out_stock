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
        default:fns.format(new Date(),"dd,mm,yyyy")
    },
    expirationDate: {
        type: Date,
        default: function () {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            return fns.format(currentDate,"dd,mm,yyyy");
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