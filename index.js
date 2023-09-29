const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_signup_admin");

const express = require("express");
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000;  

const nocache= require('nocache')
const disable = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '1');
  next();
}

app.use("/static", express.static(path.join(__dirname, "public")));

const user_route =require('./routes/userRoute')
app.use('/',disable,user_route)
app.use(nocache());
const admin_route =require('./routes/adminRoute')

app.use('/admin',disable,admin_route);

app.listen(PORT, () => {
  console.log(`the server is running at Port ${PORT}`);
}); 
