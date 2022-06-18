const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const auth = require("../Middleware/auth");
const mongoose = require("mongoose");
const moment = require("moment");
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

require("dotenv").config();

router.get("/explore", [auth, urlencoded], async (req, res) => {
  let given_pattern = req.query.search;
  if (given_pattern != "") {
    try {
      const re_obj = await Tournament.find({
        name: new RegExp(given_pattern, "i"),
      });

      return res.render("admins/explore", {
        tournaments: re_obj,
        moment: moment,
        given_pattern: given_pattern,
      });
    } catch (err) {
      console.log(err);
      return res.render("error", { msg: ["Server Busy Please try again!"] });
    }
  } else {
    try {
      const obj = await Tournament.find({});

      return res.render("admins/explore", {
        tournaments: obj,
        moment: moment,
        given_pattern: "",
      });
    } catch (err) {
      return res.render("error", { msg: ["Server Busy Please try again!"] });
    }
  }
  return res.render("admins/explore", { posts: [] });
});
router.get("/create", [auth, urlencoded], async (req, res) => {
  return res.render("admins/create_tournament", { msg: [], given_pattern: "" });
});
router.post("/store", [auth, urlencoded], async (req, res) => {
  if (req.body.numofteams == "") {
    req.body.numofteams = 0;
    req.body.playerspteam = 0;
    req.body.number_single_player = parseInt(req.body.number_single_player);
  } else {
    req.body.numer_single_player = 0;
    req.body.numofteams = parseInt(req.body.numofteams);
    req.body.playerspteam = parseInt(req.body.playerspteam);
  }
  req.body.start_date = new Date(req.body.start_date);
  req.body.end_date = new Date(req.body.end_date);
  const E = req.body.end_date;
  const S = req.body.start_date;
  try {
    const all_records = await Tournament.find({
      start_date: { $lte: E },
      end_date: { $gte: S },
    });
    if (all_records.length) {
      return res.render("admins/create_tournament", {
        msg: ["There is tournament in this slot , please try different date"],
      });
    } else {
      const obj = new Tournament(req.body);
      try {
        const result = await obj.save();

        return res.send(result);
      } catch (err) {
        return res.render("error", { msg: [err] });
      }
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }

  return res.send(req.body);
});
router.get("/tournament/:id", [auth, urlencoded], async (req, res) => {
  const tid = req.params["id"];
  try {
    const obj = await Tournament.findById(tid);
    if (obj) {
      return res.render("/admins/view_tournament", {
        tournament: obj,
        given_pattern: "",
      });
    } else {
      return res.render("error", { msg: ["Wrong Id"] });
    }
  } catch (err) {
    return res.render("error", { msg: ["TRY AGAIN"] });
  }
});
module.exports = router;
