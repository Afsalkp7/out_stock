  const express = require("express");
  const jwt = require("jsonwebtoken");
  const adminCollection = require("../model/adminModel");
  const app = express();
  const secretKey = process.env.secretKey

  function auth(req, res, next) {
      const token = req.cookies.session;
      if (!token) {
        return res.status(401).render("error",{error:error});
      }
      try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
      } catch (error) {
        res.status(401).render("error",{error:error});
      }
    }
    
  module.exports = auth;