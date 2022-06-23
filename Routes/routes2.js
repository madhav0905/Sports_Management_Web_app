const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const auth = require("../Middleware/auth");
const mongoose = require("mongoose");
const moment = require("moment");

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
        tname: new RegExp(given_pattern, "i"),
      });

      return res.render("admins/explore", {
        tournaments: re_obj,
        moment: moment,
        given_pattern: given_pattern,
        active_tab: 1,
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
        active_tab: 1,
      });
    } catch (err) {
      return res.render("error", { msg: ["Server Busy Please try again!"] });
    }
  }
});
router.get("/create", [auth, urlencoded], async (req, res) => {
  return res.render("admins/create_tournament", {
    msg: [],
    given_pattern: "",
    moment: moment,
    active_tab: 2,
  });
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
      const errmsg =
        "There is a tournament already in this slot from " +
        moment(all_records[0].start_date).format("YYYY-MM-DD") +
        " to " +
        moment(all_records[0].end_date).format("YYYY-MM-DD");
      return res.render("admins/create_tournament", {
        msg: [errmsg],
        given_pattern: "",
        moment: moment,
        active_tab: 2,
      });
    } else {
      const other_obj = await Tournament.find({ tname: req.body.tname });
      if (other_obj.length) {
        return res.render("admins/create_tournament", {
          msg: [
            "There is already A Tournament with the same name Please change the name",
          ],
          given_pattern: "",
          moment: moment,
          active_tab: 2,
        });
      }

      const obj = new Tournament(req.body);

      try {
        const result = await obj.save();

        return res.redirect("/admin/explore");
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
    const obj = await Tournament.findById(tid).populate([
      {
        path: "team_id",
        populate: [{ path: "players_id" }, { path: "created_player_id" }],
      },
      { path: "pid" },
    ]);
    if (obj) {
      return res.send(obj);
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
router.get("/tournaments/:id", [auth, urlencoded], async (req, res) => {
  const tid = req.params["id"];
  try {
    const obj = await Tournament.findById(tid).populate([
      {
        path: "team_id",
        populate: [{ path: "players_id" }, { path: "created_player_id" }],
      },
      { path: "pid" },
    ]);
    if (obj) {
      return res.render("admins/view_tournament", {
        tournament: obj,
        given_pattern: "",
        active_tab: 2,
      });
    } else {
      return res.render("error", { msg: ["Wrong Id"] });
    }
  } catch (err) {
    return res.render("error", { msg: ["TRY AGAIN"] });
  }
});
router.get("/edit_tournament/:tid", [auth, urlencoded], async (req, res) => {
  const tid = req.params.tid;
  try {
    const tour_obj = await Tournament.findById(tid);
    if (tour_obj) {
      return res.render("admins/edit_tournament", {
        tournament: tour_obj,
        given_pattern: "",
        msg: [""],
        active_tab: 2,
        moment: moment,
      });
    } else {
      return res.render("error", { msg: ["wrong tournament id"] });
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});

router.post("/store/edit_tournament", [auth, urlencoded], async (req, res) => {
  ///return res.send(req.body);
  const tid = req.body.tour_id;
  try {
    const check_tname = await Tournament.find({
      tname: req.body.tname.trim(),
      _id: { $nin: [tid] },
    });

    const tour_obj = await Tournament.findById(tid);
    if (check_tname.length) {
      return res.render("admins/edit_tournament", {
        tournament: tour_obj,
        given_pattern: "",
        msg: [
          "There is tournament already with same name i.e " +
            req.body.tname +
            " pls change",
        ],
        active_tab: 2,
        moment: moment,
      });
    }
    req.body.start_date = new Date(req.body.start_date);
    req.body.end_date = new Date(req.body.end_date);
    const E = req.body.end_date;
    const S = req.body.start_date;

    const all_records = await Tournament.find({
      _id: { $nin: [tid] },
      start_date: { $lte: E },
      end_date: { $gte: S },
    });
    if (all_records.length) {
      const errmsg =
        "There is a tournament already in this slot from " +
        moment(all_records[0].start_date).format("YYYY-MM-DD") +
        " to " +
        moment(all_records[0].end_date).format("YYYY-MM-DD");
      return res.render("admins/edit_tournament", {
        msg: [errmsg],
        given_pattern: "",
        moment: moment,
        active_tab: 2,
        tournament: tour_obj,
      });
    }
    if (tour_obj) {
      tour_obj.tname = req.body.tname;
      if (tour_obj.sport_type === "single") {
        tour_obj.number_single_player = req.body.number_single_player;
      } else {
        tour_obj.numofteams = req.body.numofteams;
        tour_obj.playerspteam = req.body.playerspteam;
      }
      tour_obj.start_date = req.body.start_date;
      tour_obj.end_date = req.body.end_date;
      const final = await tour_obj.save();
      if (final) {
        console.log(final);
        return res.redirect("/admin/explore");
      } else {
        return res.render("error", { msg: ["Server Busy Please Try again"] });
      }
    } else {
      return res.render("error", { msg: ["NO TID"] });
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});

module.exports = router;
