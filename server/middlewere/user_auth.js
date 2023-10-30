const express = require("express");
const jwt = require("jsonwebtoken");
const adminCollection = require("../model/adminModel");
const app = express();
const secretKey = process.env.secretKey

async function auth(req, res, next) {
    const token = req.cookies.usersession;
    if (!token) {
      return res.redirect("/");
    }
    try {
      console.log("pp");
      const decoded = jwt.verify  (token, secretKey);
      console.log(decoded); 
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).render("error",{error:error});
    }
  }

  function isLogged(req,res,next){
    if (req.isAuthenticated()) {
      console.log(req.user);
      return next();
    }
    res.sendStatus(401)
  }
module.exports = {auth, isLogged}