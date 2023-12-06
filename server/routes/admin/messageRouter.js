const express = require("express")
const router = express.Router();
const auth = require("../../middlewere/auth")
const Contact = require("../../model/contactModel")

router.get("/",auth,async (req,res)=>{
    const messages = await Contact.find()
    res.render("admin_message",{messages})
})

router.get("/:id",async(req,res)=>{
    const msgId = req.params.id;
    const message = await Contact.findOne({_id:msgId})
    res.render("adminMsgSingle",{message})
})

router.get("/delete/:id",async (req,res)=>{
    const msgId = req.params.id
    const message = await Contact.findOne({_id:msgId})
    res.json(message)
})

router.delete("/delete",async(req,res)=>{
    const msgId = req.body._id;
    const messageDelete = await Contact.findByIdAndRemove(msgId)
    res.json(messageDelete)
})
module.exports = router