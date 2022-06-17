function toggle_in_out() {
  var select_pointer = document.getElementById("sport_type");
  var pointer_for_single = document.getElementById("for_single");
  var pointer_for_team = document.getElementById("for_team");
  var pointer_for_team_players = document.getElementById("for_team_players");

  if (select_pointer.value === "single") {
    let check_single_num = form.elements["number_single_player"];
    // let check_num_teams = form.elements["numofteams"];
    // let check_num_playerspteam = form.elements["players_pteam"];
    pointer_for_single.style.display = "block";
    check_single_num.value = "";
    pointer_for_single.required = true;
    // check_num_teams.value = 0;
    pointer_for_team.style.display = "none";
    // check_num_playerspteam.value = 0;
    pointer_for_team_players.style.display = "none";
    pointer_for_team.required = false;

    pointer_for_team_players.required = false;
  } else {
    //let check_single_num = form.elements["number_single_player"];

    //check_single_num.value = 0;
    pointer_for_single.style.display = "none";
    pointer_for_team.style.display = "block";

    pointer_for_team.required = true;
    pointer_for_team_players.required = true;

    pointer_for_team_players.style.display = "block ";

    pointer_for_single.required = false;
    let check_num_teams = form.elements["numofteams"];
    let check_num_playerspteam = form.elements["playerspteam"];
    check_num_teams.value = "";
    check_num_playerspteam.value = "";
  }
}
let form = document.getElementById("myform");
var inputs = document.getElementsByTagName("input");
for (i = 0; i < inputs.length; i++) {
  console.log("inside for");
  inputs[i].onkeyup = checkInput;
}
function checkInput() {
  let check_name = form.elements["name"];
  let check_sport = form.elements["sport"];
  let check_single_num = form.elements["number_single_player"];
  let check_num_teams = form.elements["numofteams"];
  let check_num_playerspteam = form.elements["playerspteam"];
  let check_start_date = form.elements["start_date"];
  let check_end_date = form.elements["end_date"];
  let start_date = new Date(check_start_date.value);
  let end_date = new Date(check_end_date.value);
  if (end_date.getTime() < start_date.getTime()) {
    console.log("should handlwe error");
  }
  //write regex for all sports
  //user select_pointer for which type
  //if single validate only one or else we get unnecessary errors
  console.log(check_start_date.value);
  console.log(end_date);
}
