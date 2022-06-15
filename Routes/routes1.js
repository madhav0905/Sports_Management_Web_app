const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bodyparser = require("body-parser"); //middleware
const urlencoded = bodyparser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const validate = require("../validate/validate_register");
const { User, Team, Tournament } = require("../Schemas/model");
require("dotenv").config();
router.post("/store", [urlencoded], async (req, res) => {
  //validate
  const blood_grp = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "O"];
  if (!blood_grp.includes(req.body.bloodgroup)) {
    return res.render("error", { msg: "Blood Group Not there" });
  }

  const check = validate(req.body);

  if (check.error) {
    console.log(check.error.details[0].message);
    return res.render("error", { msg: check.error.details[0].message });
  }
  return res.send(req.body);
});
module.exports = router;
