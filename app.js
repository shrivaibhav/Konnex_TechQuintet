const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const passport = require("passport");
const configurePassport = require("./config/passport.js");
const users = require("./routes/users");
const ideas = require("./routes/ideas");
const cors = require("cors");

const app = express();

app.get("/", (req, res) => {
  console.log("working");
  res.json({ msg: "working" });
});

//const port = process.env.port || 5000;
const port = 5000;
app.listen(port, () => {
  console.log("Server is up on 5000");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
configurePassport(passport);

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected Mongoose");
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use("/api/users", users);
app.use("/api/ideas", ideas);
