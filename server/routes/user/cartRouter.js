const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel");
const userCollection = require("../../model/userModel");
const CartItem = require("../../model/cartModel");
const { authCart } = require("../../middlewere/user_auth");

router.get("/", authCart, async (req, res) => {
  try {
    if (req.cookies.buynowPrduct) {
      res.clearCookie("buynowPrduct");
      res.clearCookie("buynowQuantity");
    }
    const userId = req.userId;
    const cartItems = await CartItem.find({ userId });
    if (cartItems.length == 0) {
      res.render("cart", { noItem: true });
    }
    const cartProducts = [];

    for (let cartItem of cartItems) {
      const productId = cartItem.productId;
      const quantity = cartItem.quantity;

      const cartContent = await Product.find({ _id: productId });
      if (cartContent) {
        if (cartContent[0].quantity > 0) {
          cartProducts.push({ cartContent, quantity });
        } else {
          cartProducts.push({ cartContent, quantity });
        }
      }
    }
    res.render("cart", { cartProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the request");
  }
});

router.post("/", authCart, async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity } = req.body;
    let existingCartItem = await CartItem.findOne({
      userId,
      productId: itemId,
    });
    if (existingCartItem) {
      const product = await Product.findById(itemId);
      console.log(product);
      existingCartItem.quantity =
        parseInt(existingCartItem.quantity) + parseInt(quantity);
      if (existingCartItem.quantity <= product.quantity) {
        const updatedCartItem = await existingCartItem.save();
        const message = { msg: "Item Added to cart successfully" };
        return res.json(message);
      } else {
        const message = {
          msg: `Only ${product.quantity} stocks are available`,
        };
        return res.json(message);
      }
    }
    const cartItem = new CartItem({
      userId,
      productId: itemId,
      quantity,
    });
    console.log(cartItem);
    const cartAdded = await cartItem.save();
    if (cartAdded) {
      return res.json(cartAdded);
    } else {
      const wrong = { msg: "Product can't added to cart" };
      res.render("product", { wrong });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete/:id", authCart, async (req, res) => {
  const proId = req.params.id;
  try {
    const product = await CartItem.findOne({ productId: proId });

    if (product) {
      return res.json(product);
    } else {
      res.status(404).json({ error: "product not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const cartId = req.body.pro_id;
    const deleteProduct = await CartItem.findByIdAndRemove(cartId);
    res.json(deleteProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the request on cart delete");
  }

});

router.put("/updateQuantity", authCart, async (req, res) => {
  try {
    const userId = req.userId;
  const { productId, newQuantity } = req.body;
  const product = await Product.findById(productId);
  if (newQuantity <= product.quantity) {
    const updateQuantity = await CartItem.findOneAndUpdate(
      { userId, productId },
      { $set: { quantity: newQuantity } }
    );
    res.json(updateQuantity);
  } else {
    const notUpdatedQuantity = await CartItem.findOne({ userId, productId });
    res.json(notUpdatedQuantity);
  }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the request on edit cart items");
  }
});

module.exports = router;
