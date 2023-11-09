const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User' 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Product' 
    },
    quantity: {
        type : Number,
    },
})

const CartItem = mongoose.model("CartItem",cartSchema);

module.exports = CartItem;