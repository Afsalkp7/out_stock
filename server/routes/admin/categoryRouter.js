const Category = require("../../model/category");
const express = require("express")
const router = express.Router();
const auth = require("../../middlewere/auth")
const adminCollection = require("../../model/adminModel")

router.get("/",auth , async (req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        const categories = await Category.find()
        res.render("adminCategory",{admin,categories})
    }else{
        res.redirect("/admin")
    }
})

router.get("/:id",async(req,res)=>{
    const id = req.params.id;

    try {
        const cat = await Category.findOne({ _id: id });
        if (cat) {
          res.json(cat);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

router.post("/", async (req,res)=>{
    let category = new Category({
        name: req.body.categoryName,
        description : req.body.description
    })
    category = await category.save();
    if(!category){
        return res.render(404,"error");
    }else{
        res.redirect("/admin/categories")
    }
})

router.get("/update/:id",async (req,res)=>{
    const catId = req.params.id;
  
    try {
      const category = await Category.findOne({ _id: catId });
      
      if (category) {
        return res.json(category);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
})

router.put("/update",async (req,res)=>{
    const user_id=req.body.user_id;
    const catUpdate = await Category.findOneAndUpdate({_id:user_id},{$set:req.body})
    return res.json(catUpdate)
})

router.delete("/:id",async (req,res)=>{
    const userId = req.params.id;
    const deleteCat = await Category.findByIdAndRemove({_id:userId});
    return res.json(deleteCat)
})

module.exports = router