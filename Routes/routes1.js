const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bodyparser = require("body-parser"); //middleware
const urlencoded = bodyparser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const validate_joi = require("../validate/validate_register");
const { User, Team, Tournament } = require("../Schemas/model");

require("dotenv").config();
router.get("/s", async (req, res) => {
  const obj = {
    user_name: "admin",
    password: "admin12345",
    name: "admin",
    address: "Zoho Chennai",
    age: 25,
    bloodgroup: "B+",
    role: "admin",
  };

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(obj.password, salt);
    obj.password = hashed;
  } catch (err) {
    return res.send(err);
  }
  const result = new User(obj);
  try {
    const ans = await result.save();
    return res.send(ans).status(200);
  } catch (err) {
    return res.status(400).send(err);
  }
});
router.post("/store", [urlencoded], async (req, res) => {
  //validate
  const blood_grp = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "O"];
  if (!blood_grp.includes(req.body.bloodgroup)) {
    return res.render("error", { msg: ["Unknown Blood Group"] });
  }
  const schema = Joi.object({
    user_name: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).required(),
    name: Joi.string().min(3).required(),
    address: Joi.string().required().min(5),
    age: Joi.number().integer().required().positive(),
    bloodgroup: Joi.string().required().min(1).max(3),
  });
  const check = validate_joi(schema, req.body);

  if (check.error) {
    console.log(check.error.details[0].message);
    return res.render("error", { msg: [check.error.details[0].message] });
  }
  return res.send(req.body);
});
router.post("/loggedin", [urlencoded], async (req, res) => {
  const schema = Joi.object({
    user_name: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).required(),
  });
  const ms = _.pick(req.body, ["user_name", "password"]);
  console.log(ms);
  const check = validate_joi(schema, req.body);
  if (check.error) {
    console.log(check.error);
    console.log(check.error.details[0].message);
    return res.render("error", { msg: [check.error.details[0].message] });
  }
  return res.send(req.body);
});
module.exports = router;
