const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const auth = require("../Middleware/auth");
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
const moment = require("moment");
require("dotenv").config();

router.get("/explore", [auth, urlencoded], async (req, res) => {
  const tour_name = req.query.search;
  const user_id = req.decoded;
  try {
    const user_obj = await User.findById(user_id);
    if (user_obj) {
      const user_tid = user_obj.tournament_id;
      console.log(user_tid);
      const target_date = new Date(moment().add(1, "days"));
      console.log(target_date);
      if (tour_name) {
        await Tournament.find({
          status_tournament: "Active",
          _id: { $nin: user_tid },
          start_date: { $gte: target_date },
          name: tour_name,
        })
          .then((obj) => res.send(obj))
          .catch((err) => res.render("error", { msg: [err] }));
      } else {
        console.log("hi");

        await Tournament.find({
          status_tournament: "Active",
          _id: { $nin: user_tid },
          start_date: { $gte: target_date },
        })
          .then((obj) => res.send(obj))
          .catch((err) => res.render("error", { msg: [err] }));
      }
    } else {
      return res.render("error", {
        msg: ["System Fault Please clear Cookies and start again"],
      });
    }
  } catch (err) {
    return res.render("error", { msg: ["Please Try Again"] });
  }

  // return res.render("/user/explore",{tournaments:,given_pattern:tour_name})
});

module.exports = router;
