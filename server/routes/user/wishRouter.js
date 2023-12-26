const express = require("express");
const router = express.Router();
const Product = require("../../model/productModel");
const userCollection = require("../../model/userModel");
const WishItem = require("../../model/wishModel");
const { authCart } = require("../../middlewere/user_auth");

router.get("/", authCart, async (req, res) => {
  const userId = req.userId;
  const wishItems = await WishItem.find({ userId });

  const wishProducts = [];

  for (let wishItem of wishItems) {
    const productId = wishItem.productId;
    const wishContent = await Product.find({ _id: productId });
    if (wishContent) {
      wishProducts.push({ wishContent, quantity: 1 });
    }
  }
  console.log(wishProducts);
  if (wishProducts.length == 0) {
    return res.render("wishlist", { noItem: true });
  }
  return res.render("wishlist", { wishProducts });
});

router.post("/", authCart, async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;
    const exist = await WishItem.findOne({ productId: itemId });
    if (exist == null) {
      const wishItem = new WishItem({
        userId,
        productId: itemId,
      });
      const wishAdded = await wishItem.save();
      if (wishAdded) {
        const message = {msg:"Product added to wishlist successfuly"}
        res.json(message);
      } else {
        const wrong = { msg: "Product can't added to wishlist" };
        res.render("product", { wrong });
      }
    }else{
      const message = {msg:"Product is already in wishlist"}
      res.json(message);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete/:id", authCart, async (req, res) => {
  const proId = req.params.id;
  try {
    const product = await WishItem.findOne({ productId: proId });

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
  const cartId = req.body.pro_id;
  const deleteProduct = await WishItem.findByIdAndRemove(cartId);
  return res.json(deleteProduct);
});

module.exports = router;
