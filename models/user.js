const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  hashedPassword: String,
});

module.exports = User;
