var express = require('express');
var router = express.Router();
var User = require('../models/user');
var crypto = require('crypto');

var tokenGenerator = require('jsonwebtoken');
var tokenParser = require("express-jwt");

const TOKEN_SECRET = 'THIS IS A SIMPLE PASSWORD TO SIGN TOKEN.';

function generateHash(password) {
  const hash = crypto.createHash('sha512');
  const hashedPassword = hash.update(password).digest("hex");
  
  return hashedPassword;
}

function generateAccessToken(user) {
  return tokenGenerator.sign(user, TOKEN_SECRET, { expiresIn: "1800s" });
}

/* user login. */
router.post('/login', function(req, res, next) {
  User.findOne({ email: req.body["email"] })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          status: 404,
          message: "No user found.",
        });

        return;
      }

      const password = req.body["password"];
      const hashedPassword = generateHash(password);

      if (user.hashedPassword !== hashedPassword) {
        res.status(401).send({
          status: 401,
          message: "Invalid credentials provided.",
        });

        return;
      }

      const token = generateAccessToken({
        _id: user._id,
        email: user.email,
        name: user.name,
      });

      res.status(200).send({
        status: 200,
        message: "User logged in successfully.",
        user: user,
        token: token,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 500,
        message: `Login process failed unexpectedly.`,
      });
    });
});

/* POST user. */
router.post('/register', function(req, res, next) {
  const password = req.body['password'];
  const confirmPassword = req.body["confirmPassword"];

  if (password !== confirmPassword) {
    res.status(400).send({
      status: 400,
      message: `Password and confirm password do not match.`,
    });
  }

  const hashedPassword = generateHash(password);
  const file = req.files["profilePicture"];
  const filePath = `./uploads/${file.name}`;
  file.mv(filePath);
  console.log("hello", file.size);
  const user = new User({
    name: req.body["name"],
    email: req.body["email"],
    hashedPassword: hashedPassword,
    profilePicture: filePath,
  });

  user.save().then(() => {
    // sending response to user...
    res.status(200).send({
      status: 200,
      message: "Registration completed successfully.",
      user: user,
    });
  }).catch(error => {
    console.log(error);

    // duplicate key error...
    if (error.code === 11000) {
      res.status(400).send({
        status: 400,
        message: `Email id is already used.`,
      });
    }

    res.status(500).send({
      status: 500,
      message: `Registration process failed unexpectedly.`,
    });
  });
});

router.get(
  "/secured",
  tokenParser({ algorithms: ["HS256"], secret: TOKEN_SECRET }),
  function (req, res, next) {
    const user = req.user;

    console.log(user);

    res.status(200).send({
      status: 200,
      message: `I am secure endpoint. You are ${user.name} If you are seeing this, it means you have token.`,
    });
  }
);

router.get("/insecure", function (req, res, next) {
  res.status(200).send({
    status: 200,
    message: `I am insecure endpoint. No need token.`,
  });
});


router.get("/allusers", function (req, res, next) {
  User.find().then((users) => {
    res.status(200).send({
      status: 200,
      message: "All students retrieved successfully.",
      users: users,
      x: 100,
    });
  });
});



router.post("/info", function (req, res, next) {
  const email = req.body.email;
  const profilePicture = req.files["profilePicture"];
  const filePath = `./uploads/${profilePicture.name}`;
  profilePicture.mv(filePath);

User.findOne({ email: email })
  .then((user) => {
    if (!user) {
      res.status(404).send({
        status: 404,
        message: "No user found.",
      });

      return;
    }

    user.profilePicture = filePath;
    user.save();

    res.status(200).send({
      status: 200,
      message: "Request processed successfully.",
    });
  })
  .catch((error) => {
    res.status(500).send({
      status: 500,
      message: `An error occured unexpectedly.`,
    });
  });
});

module.exports = router;
