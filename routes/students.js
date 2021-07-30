var express = require("express");
const Student = require("../models/student");
var router = express.Router();

// const students = {};

router.get("/:name", function (req, res, next) {
    const name = req.params['name'];
  Student.findOne({ name: name })
  .then(student => {

    // if student is null or undefined...
    if (!student) {
      res.status(404).send({
        status: 404,
        message: "No student found.",
      });

      return;
    }
//  res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send({
      status: 200,
      message: "Student retrieved successfully.",
      student: student,
    });
  });
});



router.get("/", function (req, res, next) {

  Student.find().then(students => {
res.status(200).send({
  status: 200,
  message: "All students retrieved successfully.",
  students: students,
  x: 100,
});
  });
    
});

router.post("/", function (req, res, next) {
  
      const id = req.body._id;
      const name = req.body.name;
      const age = req.body.age;
      const isUser = req.body.isUser;
      const balance = req.body.balance;

      const student = new Student({
        _id: id,
        name: name,
        age: age,
        isUser: isUser,
        balance:balance,
      });

      // saves student informationy
      student.save()
        .then(() => {
          // sending response to user...
          res.status(200).send({
            status: 200,
            message: "Student created successfully.",
            student: student,
          });
        })
        .catch(error => {
          res.status(500).send({
            status: 500,
            message: "An error occurred." + error.message,
          });
        }); 

      
});

router.put("/:name", function (req, res, next) {
  const name = req.params.name;
  const age = req.body.age;
  const isUser = req.body.isUser;
  const balance = req.body.balance;

  const updatedStudentData = {
    age: age,
    isUser: isUser,
    balance: balance,
  };

  // saves student informationy
  Student.findOneAndUpdate(
    {
      name: name,
    },
    updatedStudentData, {
      new: true,
    }
  )
    .then((student) => {
      // sending response to user...
      res.status(200).send({
        status: 200,
        message: "Student updated successfully.",
        student: student,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 500,
        message: "An error occurred." + error.message,
      });
    }); 
});

router.delete("/:name", function (req, res, next) {
  const name = req.params.name;

  // deletes student informationy
  Student.findOneAndDelete(
    {
      name: name,
    }
  )
    .then((student) => {
       if (!student) {
         res.status(404).send({
           status: 404,
           message: "No student found.",
         });

         return;
       }
      // sending response to user...
      res.status(200).send({
        status: 200,
        message: "Student deleted successfully.",
        student: student,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 500,
        message: "An error occurred." + error.message,
      });
    });
});

module.exports = router;
