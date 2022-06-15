const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const tournamentschema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  sport: { type: String, required: true },
  sport_type: { type: String, required: true },
  numofteams: { type: "Number", default: 0 },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  curr_num_teams: { type: "Number", default: 0 },
  status_tournament: { type: String, default: "Active" },
  //team
  team_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
});
const userschema = new mongoose.Schema({
  user_name: { type: String, unique: true, minlength: 5, required: true },
  name: { type: String, minlength: 5, required: true },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  age: {
    type: "Number",
    required: true,
  },
  address: {
    type: String,
    minlength: 5,
    required: true,
    //team
    //tournament
  },
  team_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
  tournament_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
  teams_created_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
  role: {
    type: String,
    default: "user",
  },
});
const teamschema = new mongoose.Schema({
  team_name: {
    type: String,
    unique: true,
    required: true,
  },
  tournament_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tournament",
    required: true,
  },
  req_num: {
    type: "Number",
    required: true,
  },
  vacancies: {
    type: "Number",
  },
  status: {
    type: String,
    deafult: "Active",
  },
  players_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: "user" }],
  },
  created_player_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const User = new mongoose.model("user", userschema);
const Team = new mongoose.model("team", teamschema);
const Tournament = new mongoose.model("tournament", tournamentschema);
module.exports.User = User;
module.exports.Team = Team;
module.exports.Tournament = Tournament;
