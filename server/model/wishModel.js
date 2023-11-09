const mongoose = require('mongoose');

const wishtSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User' 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Product' 
    },
})

const WishItem = mongoose.model("WishItem",wishtSchema);

module.exports = WishItem;