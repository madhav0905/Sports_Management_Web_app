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
const axios = require("axios");
const { route } = require("./routes3");
let a_t = "s";
router.use(coo("random"));
let refreshTokens = [];
require("dotenv").config();
router.get("/login", (req, res) => {
  res.render("login", { msg: [], dat: { user_name: "", password: "" } });
});

router.get("/register", (req, res) => {
  res.render("register", { msg: [] });
});
router.post("/token", [urlencoded], async (req, res) => {
  const refreshToken = req.body["cookie"]; // If token is not provided, send error message

  if (!refreshToken) {
    res.cookie("refresh_token", "", {
      expires: new Date(0),
      domain: "localhost",
      path: "/",
    });
    return res.redirect("/");
  }

  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    return res.redirect("/");
  }

  try {
    const ans = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const { _id, role } = ans;
    const accessToken = jwt.sign(
      { _id: ans._id, role: ans.role },
      process.env.secret,
      {
        expiresIn: "10s",
      }
    );

    res.cookie("access_token", "", {
      expires: new Date(0),
      domain: "localhost",
      path: "/",
    });

    return res.send({
      nextUrl: req.body["base"] + req.body["url"],
      jwtthing: accessToken,
    });
  } catch (error) {
    console.log(error);

    res.cookie("refresh_token", "", {
      expires: new Date(0),
      domain: "localhost",
      path: "/",
    });
    return res.redirect("/");
    res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
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

      try {
        if (decrypted_password) {
          const token = jwt.sign(
            { _id: obj._id, role: obj.role },
            process.env.secret,
            { expiresIn: "10s" }
          );
          const refreshToken = jwt.sign(
            { _id: obj._id, role: obj.role },
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );

          res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });

          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          refreshTokens.push(refreshToken);
          if (obj.role === "admin") {
            return res.redirect("/admin/explore");
          } else {
            //has to fill for user
            return res.redirect("/user/explore");
          }
        } else {
          return res.render("login", {
            msg: ["Incorrect Password"],
            dat: req.body,
          });
        }
      } catch (err) {
        return res.render("login", { msg: [err], dat: req.body });
      }
    } else {
      return res.render("login", { msg: ["Wrong Email"], dat: req.body });
    }
  } catch (err) {
    console.log(err);
    return res.render("login", { msg: ["Try again"], dat: req.body });
  }
});

module.exports.router1 = router;
