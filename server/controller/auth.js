const express = require("express");
const jwt = require("jsonwebtoken");
const adminCollection = require("../model/adminModel");
const app = express();
const secretKey = process.env.secretKey

function auth(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
  
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  }
  
module.exports = auth;