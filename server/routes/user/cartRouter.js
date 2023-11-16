const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel")
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel")
const { authCart } = require("../../middlewere/user_auth");


router.get("/",authCart,async(req,res)=>{
    const userId = req.userId
    const cartItems = await CartItem.find({userId})

    const cartProducts = [];

    for (let cartItem of cartItems){
        const productId = cartItem.productId;
        const quantity = cartItem.quantity;

        const cartContent = await Product.find({_id:productId})
        if (cartContent){
            cartProducts.push({cartContent,quantity})
        }
    }
    console.log(cartProducts); 
    res.render("cart",{cartProducts})
})

router.post('/',authCart,async(req,res)=>{
   try {
    const userId = req.userId
    const { itemId, quantity } = req.body;
    let existingCartItem = await CartItem.findOne({ userId, productId: itemId });
    if (existingCartItem) {
        existingCartItem.quantity =parseInt(existingCartItem.quantity) + parseInt(quantity) ;
        const updatedCartItem = await existingCartItem.save();
        
        return res.json(updatedCartItem);
    }
    const cartItem = new CartItem({
        userId,
        productId:itemId,
        quantity
    })
    const cartAdded = await cartItem.save()
    if (cartAdded) {
        return res.json(cartAdded)
    }else{
        const wrong  = {msg:"Product can't added to cart"}
        res.render("product",{wrong})
    }
   } catch (error) {
    console.log(error);
   }
})

router.get("/delete/:id",authCart,async(req,res)=>{
    const proId = req.params.id;
    try {
        const product = await CartItem.findOne({ productId: proId });
        
        if (product) {
          return res.json(product);
        } else {
          res.status(404).json({ error: 'product not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })

    router.delete("/delete",async (req,res)=>{
        const cartId = req.body.pro_id;
        const deleteProduct = await CartItem.findByIdAndRemove(cartId);
        return res.json(deleteProduct)
    })

module.exports = router;