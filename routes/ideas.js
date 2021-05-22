const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");
const Idea = require("../models/Idea");
const ideasValidations = require("./validation/ideasValidations");
const usersValidations = require("./validation/usersValidation");
const cors = require("cors");

router.get("/", () => {
  console.log("Ideas api works");
});

// @route POST api/ideas/register
// @access PUBLIC
router.post(
  "/register",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("passport auth success inside reg idea");
    console.log("REQ: ", req.body);
    const { errors, isValid } = ideasValidations.validateRegisterIdea(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newIdea = new Idea({
      username: req.body.username,
      description: req.body.description,
      rewardsEarned: req.body.rewardsEarned,
      tags: req.body.tags,
    });
    newIdea.save().then((idea) => {
      console.log("idea saved: ", idea);
      res.json(idea);
    });
  }
);

router.post(
  "/myIdeas",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    User.findOne({ username: username }).then((user) => {
      if (!user) {
        errors.username = "username not found";
        return res.status(404).json(errors);
      }
    });
    let resultIdeas = [];
    var totalRewards = 0;
    Idea.find({ username: req.body.username }, (err, docs) => {
      if (err) {
        errors.msg = "some error occured";
        errors.err = err;
        console.error("error in find ideas");
        return res.status(400).json(errors);
      }
      resultIdeas = docs;
      docs.forEach((doc) => {
        // resultIdeas.push(doc);
        totalRewards = totalRewards + doc.rewardsEarned;
      });
    });
    return res.json({
      ideas: resultIdeas,
      totalRewards: totalRewards,
    });
    // also return idea.id
  }
);

router.post(
  "/allIdeas",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Idea.find({}, (err, docs) => {
      if (err) {
        errors.msg = "some error occured";
        errors.err = err;
        console.error("error in find ideas all");
        return res.status(400).json(errors);
      }
      return res.json({
        ideas: docs,
      });
    });
  }
);

router.post(
  "/updateIdea",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, response) => {
    const { errors, isValid } = ideasValidations.validateUpdate(
      req.body.description
    );
    if (!isValid) {
      return res.status(400).json(erros);
    }
    Idea.findByIdAndUpdate(
      req.body.ideaID,
      {
        $set: {
          description: req.body.description,
          tags: req.body.tags,
        },
      },
      (err, doc, res) => {
        if (err) {
          errors.msg = "some error in updating idea";
          errors.err = err;
          console.error("error in updating idea: ", err);
          return response.status(500).json(errors);
        } else if (!doc) {
          errors.msg = "some error in updating idea";
          errors.err = "No doc found";
          console.error("error in updating idea: no idea with given id");
          return response.status(500).json(errors);
        }
        console.log("old idea:", doc);
        doc.description = req.body.description;
        doc.tags = req.body.tags;
        return response.json(doc);
      }
    );
  }
);

router.post(
  "/deleteIdea",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, response) => {
    const errors = usersValidations.validateUsername(req.body.username).errors;
    const isUserAdmin = false;
    Idea.findOne({ _id: req.body.ideaID }).then((doc) => {
      if (!doc) {
        errors.msg = "some error in deleting idea";
        errors.err = "No doc found";
        console.error("error in deleting idea: no idea with given id");
        return response.status(400).json(errors);
      }
      if (doc.username !== req.body.username) {
        User.findOne({ username: req.body.username }, (err, user) => {
          if (err) {
            errors.msg = "some error in deleting idea";
            errors.err = "associated user not found";
            console.error("error in deleting idea");
            return response.status(400).json(errors);
          }
          if (user.type.toUpperCase() !== "ADMIN") {
            errors.msg = "some error in deleting idea";
            errors.err = "not authorised for this action";
            console.error("user not authorised for this action");
            return response.status(400).json(errors);
          }
        });
      }
      doc.delete();
    });
    // Idea.findByIdAndDelete(req.body.ideaID, (err, doc, res) => {
    //   if (err) {
    //     errors.msg = "some error in deleting the idea";
    //     errors.err = err;
    //     return response.status(500).json(errors);
    //   } else if (!doc) {
    //     errors.msg = "some error in deleting idea";
    //     errors.err = "No doc found";
    //     console.error("error in deleting idea: no idea with given id");
    //     return response.status(500).json(errors);
    //   }
    //   console.log("idea deleted of id: ", doc.id);
    //   return response.json(doc);
    // });
  }
);

router.post(
  "/deleteAll",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, response) => {
    const errors = {};

    Idea.deleteMany({}, (err) => {
      if (err) {
        errors.msg = "some error in deleting ideas";
        errors.err = err;
        return response.status(500).json(errors);
      }
      return response.json({ msg: "all ideas deleted" });
    });
  }
);

router.post(
  "/updateRewardForIdea",
  cors(),
  passport.authenticate("jwt", { session: false }),
  (req, response) => {
    // username, reward

    const { errors, isValid } = ideasValidations.validateUpdateReward(req.body);
    if (!isValid) {
      return res.status(400).json(erros);
    }

    User.findOne({ username: req.body.username }).then((user) => {
      if (!user) {
        errors.username = "username not found";
        return res.status(400).json(errors);
      }
      // Admin Check
      else if (user.type.toUpperCase() !== "ADMIN") {
        errors.msg = "You are not authorised for this action";
        return res.status(400).json(errors);
      }
    });

    Idea.findByIdAndUpdate(
      req.body.ideaID,
      {
        $set: {
          description: req.body.description,
          tags: req.body.tags,
        },
      },
      (err, doc, res) => {
        if (err) {
          errors.msg = "some error in updating idea";
          errors.err = err;
          console.error("error in updating idea: ", err);
          return response.status(500).json(errors);
        } else if (!doc) {
          errors.msg = "some error in updating idea";
          errors.err = "No doc found";
          console.error("error in updating idea: no idea with given id");
          return response.status(500).json(errors);
        }
        console.log("old idea:", doc);
        doc.description = req.body.description;
        doc.tags = req.body.tags;
        return response.json(doc);
      }
    );
  }
);

module.exports = router;
