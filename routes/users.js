const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");
const validations = require("./validation/usersValidation");
const cors = require("cors");

router.get("/", (req, res) => {
  const msg = "Users api works";
  console.log(msg);
  res.json(msg);
});

router.post("/allUsers", (req, res) => {
  // check if admin

  const errors = {};
  User.find({}, (err, users) => {
    if (err) {
      errors.msg = "some error occurred while fetching all users";
      errors.err = err;
      return res.status(400).json(errors);
    }
    return res.json(users);
  });
});

// @route POST api/users/register
// @access PUBLIC
router.post("/register", (req, res) => {
  const { errors, isValid } = validations.validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "user already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //   if (err) throw err;
          if (err) {
            console.log("bcrypt hash error ", err);
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => {
              console.log(err);
              errors.error = "Some error occured";
              res.status(500).json(errors);
            });
        });
      });
    }
  });
});

// @route POST api/users/login
// @access PUBLIC
router.post("/login", (req, res) => {
  const { errors, isValid } = validations.validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username }).then((user) => {
    if (!user) {
      errors.username = "username not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Create JWT payload
        const payload = { id: user.id, name: user.name };
        // Sign the token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            console.log("Login success");
            res.json({
              success: true,
              token: "Bearer " + token,
              userType: user.type,
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        res.status(400).json(errors);
      }
    });
  });
});

router.post(
  "/deleteAll",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, response) => {
    const errors = {};

    // check if Admin

    User.deleteMany({}, (err) => {
      if (err) {
        errors.msg = "some error in deleting users";
        errors.err = err;
        return response.status(500).json(errors);
      }
      return response.json({ msg: "all users deleted" });
    });
  }
);

module.exports = router;
