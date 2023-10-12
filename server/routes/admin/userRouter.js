const express = require("express")
const route = express.Router()
const userCollection = require("../../model/userModel")
const adminCollection = require("../../model/adminModel")
const auth = require("../../middlewere/auth")
const router = require("../user/indexRouter")




route.get("/",auth,async(req,res)=>{
    if(req.cookies.session){
        const _id = req.adminId
        const admin = await adminCollection.findOne({ _id })
        const users = await userCollection.find()
        res.render("admin_user",{ admin, users })
    }else{
        res.redirect("/admin")
    }
})

route.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await userCollection.findOne({ _id: userId });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

route.get('/update/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await userCollection.findOne({ _id: userId });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

route.put("/update/:userId", async(req,res) => {
    const userId = req.params.userId;
    const status = req.body.status;
    const updatedStatus = await userCollection.updateOne({_id:userId},{$set:{status}})
    if(updatedStatus){
        res.redirect(303,"/admin/users")
    }
})

route.get("/delete/:userId", async (req,res)=>{
  const userId = req.params.userId;
  await userCollection.findByIdAndRemove(userId);
  res.redirect("/admin/users")  
    // try {
    //   const user = await userCollection.findOne({ _id: userId });
    //   if (user) {
    //     res.json(user);
    //   } else {
    //     res.status(404).json({ error: 'User not found' });
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   res.status(500).json({ error: 'Internal server error' });
    // }
})


module.exports = route