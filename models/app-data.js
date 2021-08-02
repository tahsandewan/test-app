const mongoose = require("mongoose");

const AppData = mongoose.model("AppData", {
  _id: String,
  lastId: Number,
});

module.exports = AppData;
