const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const { auth } = require("../Middleware/auth");
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
  let tour_name = req.query.search;

  const user_id = req.decoded;
  if (tour_name == undefined) {
    tour_name = "";
  }
  let start_date = req.query.start_date;
  let end_date = req.query.end_date;
  try {
    const user_obj = await User.findById(user_id);
    if (user_obj) {
      const user_tid = user_obj.tournament_id;

      const target_date = new Date(moment().add(1, "days"));

      if (start_date != undefined && end_date != undefined) {
        await Tournament.find({
          status_tournament: "Active",
          _id: { $nin: user_tid },
          start_date: { $gte: target_date },
          $and: [
            { start_date: { $gte: new Date(start_date) } },
            { end_date: { $lte: new Date(end_date) } },
          ],
          tname: new RegExp("^" + tour_name, "i"),
        })
          .then((obj) => {
            const teams_obj = obj.filter((o) => {
              return o.sport_type == "team";
            });
            const single_obj = obj.filter((o) => o.sport_type === "single");

            res.render("user/explore", {
              teams_obj: teams_obj,
              single_obj: single_obj,
              given_pattern: tour_name,
              moment: moment,
              active_tab: 1,
              level: true,
              start: start_date,
              end: end_date,
            });
          })
          .catch((err) => res.render("error", { msg: [err] }));
      } else {
        await Tournament.find({
          status_tournament: "Active",
          _id: { $nin: user_tid },
          tname: new RegExp("^" + tour_name, "i"),
          start_date: { $gte: target_date },
        })
          .then((obj) => {
            const teams_obj = obj.filter((o) => {
              return o.sport_type == "team";
            });
            const single_obj = obj.filter((o) => o.sport_type === "single");

            res.render("user/explore", {
              teams_obj: teams_obj,
              single_obj: single_obj,
              given_pattern: tour_name,
              moment: moment,
              active_tab: 1,
              level: true,
              start: "",
              end: "",
            });
          })
          .catch((err) => res.render("error", { msg: [err] }));
      }
    } else {
      return res.render("error", {
        msg: ["System Fault Please clear Cookies and start again"],
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("error", { msg: ["Please Try Again"] });
  }

  // return res.render("/user/explore",{tournaments:,given_pattern:tour_name})
});
router.get("/tournament/:id", [auth, urlencoded], async (req, res) => {
  const tid = req.params["id"];
  //get tournament details
  //show form for register

  try {
    const tour_obj = await Tournament.findById(tid).populate("team_id");
    const user_obj = await User.findById(req.decoded);
    if (tour_obj && user_obj) {
      if (user_obj.tournament_id.includes(tid)) {
        return res.send("Already Registered");
      }
      if (tour_obj.status_tournament === "Active") {
        return res.render("user/register_tournament", {
          tournaments: tour_obj,
          player: req.decoded,
          given_pattern: "",
          pid: req.decoded,
          moment: moment,
          er: [],
        });
      } else {
        return res.send("no active torunament");
      }
    } else {
      return res.send("No Tournament ");
    }
  } catch (err) {
    console.log(err);
    return res.render("error", { msg: ["NO TOURNAMENT"] });
  }
});
router.post("/reg_tour_store", [auth, urlencoded], async (req, res) => {
  const tid = req.body.tid;
  const pid = req.body.pid;
  const select_type = req.body.select_type;
  /// return res.send(req.body);
  const schema = Joi.object({
    tid: Joi.objectId().required(),
    pid: Joi.objectId().required(),
    select_type: Joi.string().required(),
    req_num: Joi.number().integer().min(0).required(),
    chooseteam: Joi.objectId(),
    team_name: Joi.string().min(0),
  });
  const check = validate_joi(schema, req.body);
  if (check.error) {
    return res.render("error", { msg: [check.error] });
  }
  try {
    const user_obj = await User.findById(pid);

    if (user_obj) {
      if (user_obj.tournament_id.includes(tid)) {
        return res.send("already registered");
      }
      if (select_type == "single") {
        const data = await Tournament.findById(tid);
        if (data.number_single_player - data.curr_num_teams > 0) {
          user_obj.tournament_id.push(tid);
          data.curr_num_teams += 1;
          data.pid.push(user_obj._id);
          user_obj.pstatus.push({ tou_id: tid, val: "Active" });
          if (data.number_single_player - data.curr_num_teams == 0) {
            data.status_tournament = "Closed";
          }
          const user_save = await user_obj.save();
          const tour_save = await data.save();
          if (user_save && tour_save) {
            res.redirect("/user/explore");
          } else {
            return res.render("error", { msg: ["Try Again"] });
          } /*  user_obj
              .save()
              .then((result) =>{
                
                
                
               })
               */
        } else {
          return res.send("max participants registered Sorrry");
        }
      } else if (select_type == "choose") {
        //existing team

        const schem = Joi.object({
          chooseteam: Joi.objectId().required(),
        });
        const check = validate_joi(schem, _.pick(req.body, ["chooseteam"]));
        if (check.error) {
          return res.render("error", { msg: [check.error] });
        }
        const which_team = req.body.chooseteam;
        const data = await Team.findById(which_team);
        if (data) {
          if (data.vacancies > 0) {
            data.vacancies--;

            data.players_id.push(pid);
            data.ref_players.push({ play_id: pid, val: "pending" });
            //changing status

            const team_data = await data.save();
            const tour_obj = await Tournament.findById(tid).populate("team_id");
            if (team_data && tour_obj) {
              if (tour_obj.curr_num_teams == tour_obj.numofteams) {
                const team_id_array = tour_obj.team_id;
                var flag = -1;
                for (var i = 0; i < team_id_array.length; i++) {
                  if (team_id_array[i].vacancies != 0) {
                    flag = 1;
                    break;
                  }
                }
                if (flag == -1) {
                  //status closed;
                  tour_obj.status_tournament = "Closed";
                }
              } else {
                tour_obj.status_tournament = "Active";
              }
            }
            const tour_res = await tour_obj.save();
            if (team_data && tour_res) {
              user_obj.team_id.push(team_data._id);
              user_obj.tournament_id.push(tid);
              user_obj.pstatus.push({ tou_id: tid, val: team_data.status });
              user_obj
                .save()
                .then((fin_res) => {
                  return res.redirect("/user/explore");
                })
                .catch(() => res.render("error", { msg: ["Try again"] }));
            } else {
              return res.render("error", { msg: ["Try again"] });
            }
          } else {
            return res.send("Team has no positions left");
          }
        }

        //find team
      } else {
        //create team
        const schea = Joi.object({
          team_name: Joi.string().min(4).required(),
          req_num: Joi.number().integer().min(1).required(),
        });
        const check = validate_joi(
          schea,
          _.pick(req.body, ["team_name", "req_num"])
        );
        if (check.error) {
          return res.render("error", { msg: [check.error] });
        }
        const team_name = req.body.team_name;
        const team_there = await Team.findOne({ team_name: team_name });

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
          const tour_obj = await Tournament.findById(tid).populate("team_id");
          if (tour_obj) {
            if (team_there) {
              return res.render("user/register_tournament", {
                tn: team_name,
                tournaments: tour_obj,
                player: req.decoded,
                given_pattern: "",
                pid: req.decoded,
                moment: moment,
                er: ["there is already with the same team name"],
              });
            }

            if (tour_obj.numofteams - tour_obj.curr_num_teams > 0) {
              const result = await new_team.save();
              if (result) {
                tour_obj.team_id.push(result._id);
                tour_obj.curr_num_teams += 1;

                const final_res = await tour_obj.save();
                user_obj.team_id.push(result._id);
                user_obj.tournament_id.push(tid);
                user_obj.teams_created_id.push(result._id);
                user_obj.pstatus.push({ tou_id: tid, val: result.status });
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
  let start_date = req.query.start_date;
  let end_date = req.query.end_date;

  if (!given_pattern) {
    given_pattern = "";
  }

  try {
    if (start_date != undefined && end_date != undefined) {
      const user_obj = await User.findById(pid).populate({
        path: "tournament_id",
        match: {
          tname: new RegExp("^" + given_pattern, "i"),
          start_date: { $gte: new Date(start_date) },
          end_date: { $lte: new Date(end_date) },
        },

        populate: { path: "team_id" },
      });

      if (user_obj) {
        const teams_obj = user_obj.tournament_id.filter(
          (o) => o.sport_type == "team"
        );
        const single_obj = user_obj.tournament_id.filter(
          (o) => o.sport_type == "single"
        );

        ///  return res.send(user_obj.tournament_id);
        return res.render("user/show", {
          active_tab: 2,
          user_obj: user_obj,
          single_obj: single_obj,
          teams_obj: teams_obj,
          given_pattern: given_pattern,
          moment: moment,
          pid: pid,
          level: true,
          start: start_date,
          end: end_date,
        });
      }
    } else {
      const user_obj = await User.findById(pid).populate({
        path: "tournament_id",
        match: { tname: new RegExp("^" + given_pattern, "i") },
        populate: { path: "team_id" },
      });
      if (user_obj) {
        const teams_obj = user_obj.tournament_id.filter(
          (o) => o.sport_type == "team"
        );
        const single_obj = user_obj.tournament_id.filter(
          (o) => o.sport_type == "single"
        );

        ///  return res.send(user_obj.tournament_id);
        return res.render("user/show", {
          active_tab: 2,
          user_obj: user_obj,
          single_obj: single_obj,
          teams_obj: teams_obj,
          given_pattern: given_pattern,
          moment: moment,
          pid: pid,
          level: true,
          start: "",
          end: "",
        });
      }
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});
router.get("/join_request", [auth, urlencoded], async (req, res) => {
  const pid = req.decoded;
  const captain_teams = await Team.find({ created_player_id: pid }).populate([
    "tournament_id",
    "ref_players.play_id",
  ]);
  return res.render("user/join_request", {
    team_obj: captain_teams,
    given_pattern: "",
    moment: moment,
    active_tab: 3,
    pid: pid,
  });
});
router.post("/acceptrequest", [auth, urlencoded], async (req, res) => {
  const schema = Joi.object({
    tid: Joi.objectId().required(),
    team_id: Joi.objectId().required(),
    whichoperation: Joi.string().required().valid("add", "reject"),

    created_pid: Joi.objectId().required(),
    user_pid: Joi.objectId().required(),
  });
  const check = validate_joi(schema, req.body);
  if (check.error) {
    return res.render("error", { msg: [check.error] });
  }
  const tour_id = req.body.tid;
  const team_id = req.body.team_id;
  const created_user_id = req.body.created_pid;
  const user_id = req.body.user_pid;
  const operation = req.body.whichoperation;

  try {
    const team_obj = await Team.findById(team_id);

    if (team_obj) {
      if (operation == "add") {
        const array_ref = team_obj.ref_players;

        if (array_ref.length) {
          const ans = array_ref.filter((o) => o.play_id != user_id);

          team_obj.ref_players = ans;

          const temp_ans = await team_obj.save();
          if (temp_ans) {
            return res.redirect("/user/join_request");
          }
        } else {
          return res.render("error", { msg: ["have to debug"] });
        }
      } else if (operation == "reject") {
        const array_ref = team_obj.ref_players;
        const ans = array_ref.findIndex((o) => o.play_id == user_id);
        if (ans != -1) {
          team_obj.ref_players[ans] = { play_id: user_id, val: "rejected" };
        }
        team_obj.vacancies++;

        //have to change
        if (team_obj.status == "Closed") {
          team_obj.status = "Active";
        }
        const ind = team_obj.players_id.indexOf(user_id);

        if (ind > -1) {
          team_obj.players_id.splice(ind, 1);
        }

        const result = await team_obj.save();
        const user_data = await User.findById(user_id);
        if (user_data) {
          var te_id = user_data.team_id.indexOf(team_id);
          if (te_id > -1) {
            user_data.team_id.splice(te_id, 1);
          }
          var to_id = user_data.tournament_id.indexOf(tour_id);
          if (to_id > -1) {
            user_data.tournament_id.splice(to_id, 1);
          }
          var i = user_data.pstatus.findIndex((o) => o.tou_id == tour_id);
          if (i > -1) {
            user_data.pstatus.splice(i, 1);
          }
          const k = await user_data.save();
          if (k && result) {
            return res.redirect("/user/join_request");
          }
        }
      }
    } else {
      return res.render("error", { msg: ["Try Again"] });
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});
router.get("/user_profile", [auth, urlencoded], async (req, res) => {
  const pid = req.decoded;
  try {
    const user_obj = await User.findById(pid);
    if (user_obj) {
      return res.render("user/user_profile", {
        given_pattern: "",
        active_tab: 4,
        user_obj: user_obj,
        msg: [],
      });
    } else {
      return res.render("error", { msg: ["Wrong user Id"] });
    }
  } catch (er) {
    return res.render("error", { msg: ["Server Busy Try again!"] });
  }
});
router.post("/edituserprofile", [auth, urlencoded], async (req, res) => {
  const userid = req.decoded;
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    age: Joi.number().integer().min(2).required(),
    bloodgroup: Joi.string()
      .required()
      .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
  });
  const check = validate_joi(schema, req.body);
  if (check.error) {
    return res.render("error", { msg: [check.error] });
  }
  try {
    const user_obj = await User.findById(userid);
    user_obj.name = req.body.name;
    user_obj.address = req.body.address;
    user_obj.age = req.body.age;
    user_obj.bloodgroup = req.body.bloodgroup;
    const final = user_obj.save();
    if (final) {
      return res.redirect("/user/user_profile");
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});
router.get("/edit_password", [auth, urlencoded], async (req, res) => {
  return res.render("user/editpassword", {
    given_pattern: "",
    active_tab: 4,
    msg: [],
  });
});
router.post("/edituserpassword", [auth, urlencoded], async (req, res) => {
  const uid = req.decoded;

  const schema = Joi.object({
    curr_password: Joi.string().required().min(5),
    new_password1: Joi.string().min(5).invalid(Joi.ref("curr_password")),
    new_password2: Joi.string().min(5).valid(Joi.ref("new_password1")),
  });
  const check = validate_joi(schema, req.body);
  if (check.error) {
    return res.render("error", { msg: [check.error] });
  }
  try {
    const user_obj = await User.findById(uid);

    if (user_obj) {
      const decrypted_password = await bcrypt.compare(
        req.body.curr_password,
        user_obj.password
      );
      if (decrypted_password) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.new_password1, salt);
        user_obj.password = hashed;
        const fin = await user_obj.save();
        if (fin) {
          return res.redirect("/logged/logout");
        } else {
          return res.render("user/editpassword", {
            given_pattern: "",
            active_tab: 4,
            msg: ["try again"],
          });
        }
      } else {
        return res.render("user/editpassword", {
          given_pattern: "",
          active_tab: 4,
          msg: ["Wrong current password"],
        });
      }
    } else {
      return res.render("error", { msg: ["wrong user"] });
    }
  } catch (err) {
    return res.render("error", { msg: [err] });
  }
});
module.exports = router;
