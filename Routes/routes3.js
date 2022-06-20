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

      const target_date = new Date(moment().add(1, "days"));

      if (tour_name) {
        await Tournament.find({
          status_tournament: "Active",
          _id: { $nin: user_tid },
          start_date: { $gte: target_date },
          name: new RegExp(tour_name, "i"),
        })
          .then((obj) =>
            res.render("user/explore", {
              tournaments: obj,
              given_pattern: tour_name,
              moment: moment,
              active_tab: 1,
            })
          )
          .catch((err) => res.render("error", { msg: [err] }));
      } else {
        await Tournament.find({
          status_tournament: "Active",
          _id: { $nin: user_tid },
          start_date: { $gte: target_date },
        })
          .then((obj) =>
            res.render("user/explore", {
              tournaments: obj,
              given_pattern: "",
              moment: moment,
              active_tab: 1,
            })
          )
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
router.get("/tournament/:id", [auth, urlencoded], async (req, res) => {
  const tid = req.params["id"];
  //get tournament details
  //show form for register
  console.log("came here");
  try {
    const tour_obj = await Tournament.findById(tid).populate("team_id");

    if (tour_obj) {
      return res.render("user/register_tournament", {
        tournaments: tour_obj,
        player: req.decoded,
        given_pattern: "",
        moment: moment,
      });
    } else {
      console.log("hi");
    }
  } catch (err) {
    console.log("err time");
    return res.send(err);
  }
});
router.post("/reg_tour_store", [auth, urlencoded], async (req, res) => {
  const tid = req.body.tid;
  const pid = req.body.pid;
  const select_type = req.body.select_type;
  try {
    const user_obj = await User.findById(pid);
    if (user_obj) {
      if (user_obj.tournament_id.includes(tid)) {
        return res.send("already registered");
      }
      if (select_type == "single") {
        Tournament.findById(tid).then((data) => {
          if (data.number_single_player - data.curr_num_teams > 0) {
            user_obj.tournament_id.push(tid);
            user_obj.curr_num_teams += 1;
            user_obj
              .save()
              .then((result) => res.redirect("/user/explore"))
              .catch((err) => res.send(err));
          } else {
            return res.send("max participants registered Sorrry");
          }
        });
      } else if (select_type == "choose") {
        //existing team
        const which_team = req.body.chooseteam;
        Team.findById(which_team).then((data) => {
          if (data.vacancies > 0) {
            data.vacancies--;
            data.players_id.push(pid);
            data
              .save()
              .then((team_data) => {
                user_obj.team_id.push(team_data._id);
                user_obj.tournament_id.push(tid);
                user_obj
                  .save()
                  .then((fin_res) => {
                    return res.redirect("/user/explore");
                  })
                  .catch(() => res.render("error", { msg: ["Try again"] }));
              })
              .catch(() => res.render("error", { msg: ["Try again"] }));
          } else {
            return res.send("Team has no positions left");
          }
        });

        //find team
      } else {
        //create team
        const team_name = req.body.team_name;
        const req_num = req.body.req_num;
        const new_team = new Team({
          team_name: team_name,
          tournament_id: tid,
          req_num: req_num,
          vacancies: req_num - 1,
          players_id: [pid],
          created_player_id: pid,
        });
        try {
          const tour_obj = await Tournament.findById(tid);
          if (tour_obj) {
            if (tour_obj.numofteams - tour_obj.curr_num_teams > 0) {
              const result = await new_team.save();
              if (result) {
                tour_obj.team_id.push(result._id);
                const final_res = await tour_obj.save();
                user_obj.team_id.push(result._id);
                user_obj.tournament_id.push(tid);
                user_obj.teams_created_id.push(result._id);
                const data = await user_obj.save();
                if (data) {
                  return res.redirect("/user/explore");
                }
              }
            } else {
              return res.send("Max Participation Over");
            }
          } else {
            return res.render("error", { msg: ["Please try Again"] });
          }
        } catch (err) {
          return res.render("error", { msg: [err] });
        }
      }
    } else {
      return res.render("error", { msg: ["Please try Again"] });
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});
router.get("/show", [auth, urlencoded], async (req, res) => {
  const pid = req.decoded;
  let given_pattern = req.query.search;

  if (!given_pattern) {
    given_pattern = "";
  }
  console.log(given_pattern);
  try {
    const user_obj = await User.findById(pid).populate({
      path: "tournament_id",
      match: { tname: new RegExp(given_pattern, "i") },

      populate: { path: "team_id" },
    });
    if (user_obj) {
      return res.render("user/show", {
        active_tab: 2,
        tournament: user_obj,
        given_pattern: given_pattern,
        moment: moment,
      });
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});
module.exports = router;
