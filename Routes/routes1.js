const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");

const mongoose = require("mongoose");
//const { User, Post, Comment } = require("./Schemas/models");
//const validate = require("./Schemas/validate");
const coo = require("cookie-parser");
router.use(coo("radno,e"));
require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bodyparser = require("body-parser"); //middleware
const urlencoded = bodyparser.urlencoded({ extended: false });
const validate_joi = require("../validate/validate_register");
const { User, Team, Tournament } = require("../Schemas/model");
const auth = require("../Middleware/auth");
require("dotenv").config();
router.get("/login", (req, res) => {
  res.render("login", { msg: [] });
});

router.get("/register", (req, res) => {
  res.render("register", { msg: [] });
});

router.post("/store", [urlencoded], async (req, res) => {
  //validate

  const schema = Joi.object({
    user_name: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).required(),
    name: Joi.string().min(3).required(),
    address: Joi.string().required().min(5),
    age: Joi.number().integer().required().positive(),
    bloodgroup: Joi.string().required().min(1).max(3),
  });
  const check = validate_joi(schema, req.body);
  const result = await User.find({ user_name: req.body.user_name });

  if (result.length) {
    return res.render("register", {
      msg: ["Already registered with this Email"],
    });
  }
  if (check.error) {
    return res.render("register", {
      msg: [check.error.details[0].message],
    });
  }

  //save to database
  //generate salt and hash it
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashed;
    const obj = new User(req.body);
    await obj
      .save()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    return res.render("error", { msg: ["Server busy Please try again"] });
  }

  return res.redirect("/auth/login");
});
router.post("/loggedin", [urlencoded], async (req, res) => {
  const schema = Joi.object({
    user_name: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).required(),
  });
  const ms = _.pick(req.body, ["user_name", "password"]);

  const check = validate_joi(schema, req.body);
  if (check.error) {
    return res.render("error", { msg: [check.error.details[0].message] });
  }

  try {
    const obj = await User.findOne({ user_name: ms["user_name"] });

    if (obj) {
      const decrypted_password = await bcrypt.compare(
        ms["password"],
        obj.password
      );
      console.log(decrypted_password);
      try {
        if (decrypted_password) {
          const token = jwt.sign(
            { _id: obj._id, role: obj.role },
            process.env.secret
          );

          res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          if (obj.role === "admin") {
            return res.redirect("/admin/explore");
          } else {
            //has to fill for user
            return res.redirect("/user/explore");
          }
        } else {
          return res.render("login", { msg: ["Incorrect Password"] });
        }
      } catch (err) {
        return res.render("login", { msg: [err] });
      }
    } else {
      return res.render("login", { msg: ["Wrong Email"] });
    }
  } catch (err) {
    console.log(err);
    return res.render("login", { msg: ["Try again"] });
  }
});

module.exports = router;
