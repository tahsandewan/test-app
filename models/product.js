const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  _id: String,
  title: String,
  content: String,  
  profilePicture: String,
});

module.exports = Product;
