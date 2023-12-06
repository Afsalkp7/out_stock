const express = require("express");
const router = express.Router();
const Contact = require("../../model/contactModel");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config({ path: "config.env" });
const { config } = require("dotenv");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "afsalkpmanu31@gmail.com",
      pass: "hold thhr ucgt iaqu",
    },
  });
  
  const messageByEmail = (email, name , message) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: email,
        to: "afsalkpmanu31@gmail.com",
        subject: "Message from customer",
        text: `customer email : ${email},
        customer Name : ${name},
        Message from ${name} : ${message}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info.response);
        }
      });
    });
  };

router.get("/",async(req,res)=>{
    res.render("contactus")
})

router.post("/",async(req,res)=>{
    const {email,customerName,message} = req.body
    await messageByEmail(email,customerName,message)

    const contact = new Contact({
         email, 
         customerName,
         message,
        });
    await contact.save();

    res.json(contact)

})



module.exports = router;