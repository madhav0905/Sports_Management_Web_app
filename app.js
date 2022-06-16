const express = require("express");
const app = express();
const session = require("express-session");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);
const bcrypt = require("bcrypt");
const path = require("path");
const _ = require("lodash");
const bodyparser = require("body-parser"); //middleware
const urlencoded = bodyparser.urlencoded({ extended: false });
const mongoose = require("mongoose");
//const { User, Post, Comment } = require("./Schemas/models");
//const validate = require("./Schemas/validate");
const coo = require("cookie-parser");
app.use(coo("random"));
require("dotenv").config();
const router1 = require("./Routes/routes1");

//
mongoose
  .connect(process.env.mongo_url)
  .then(() => console.log("Connecteed to mongodb"))
  .catch((err) => console.log(err));

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", router1);
app.get("/", (req, res) => {
  return res.redirect("/auth/login");
});
app.listen(process.env.port, () => {
  console.log(`Connected to Port ${process.env.port}`);
});
