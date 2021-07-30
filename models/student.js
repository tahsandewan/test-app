
const mongoose = require("mongoose");

const Student = mongoose.model("Student", {
    _id: String,
    name: String,
    age: Number,
    isUser: Boolean,
    balance: Number,
});

module.exports = Student;
