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
  inputs[i].onkeyup = checkInput;
  inputs[i].onchange = checkInput;
}
let y = -1;
function checkInput() {
  let x = 0;
  let check_name = form.elements["tname"];
  let check_sport = form.elements["sport"];
  let check_single_num = form.elements["number_single_player"];
  let check_num_teams = form.elements["numofteams"];
  let check_num_playerspteam = form.elements["playerspteam"];
  let check_start_date = form.elements["start_date"];
  let check_end_date = form.elements["end_date"];
  let start_date = new Date(check_start_date.value);
  let end_date = new Date(check_end_date.value);
  var select_pointer = document.getElementById("sport_type");
  //write regex for all sports
  //user select_pointer for which type
  //if single validate only one or else we get unnecessary errors
  if (
    check_name.value.trim().length > 3 &&
    /^[a-zA-Z ]{5,30}$/.test(check_name.value.trim())
  ) {
    setSuccess(check_name);
  } else {
    setError(check_name, "Tournament name should be a valid String");
    x++;
  }
  if (check_name.value === "") {
    setSuccess(check_name);
  }
  if (
    check_sport.value.trim().length > 5 &&
    /^[a-zA-Z ]{5,30}$/.test(check_sport.value.trim())
  ) {
    setSuccess(check_sport);
  } else {
    setError(check_sport, "Sport Name should be Valid");
    x++;
  }
  if (check_sport.value === "") {
    setSuccess(check_sport);
  }
  if (
    check_end_date != "" &&
    check_start_date != "" &&
    end_date.getTime() < start_date.getTime()
  ) {
    setError(check_end_date, "End Date Should be before Start Date");
    x++;
  } else if (check_end_date.value != "" && check_start_date.value != "") {
    setSuccess(check_end_date);
  } else {
    setSuccess(check_end_date);
  }
  if (select_pointer.value === "single") {
    let single_num = parseInt(check_single_num.value, 10);

    if (isNaN(single_num) || !/^[1-9]\d{0,1}$/.test(check_single_num.value)) {
      setError(check_single_num, "Players should be from 2 to 100");
      x++;
    } else {
      setSuccess(check_single_num);
    }
    if (check_single_num.value.length == 0) {
      setSuccess(check_single_num);
    }
  } else {
    let team_num = parseInt(check_num_teams.value, 10);
    let player_team = parseInt(check_num_playerspteam.value, 10);
    if (isNaN(team_num) || team_num <= 1 || team_num > 20) {
      setError(check_num_teams, "Number of Teams must be from 2 to 20");
      x++;
    } else {
      setSuccess(check_num_teams);
    }
    if (check_num_teams.value === "") {
      setSuccess(check_num_teams);
    }
    if (isNaN(player_team) || player_team <= 1 || player_team > 20) {
      setError(
        check_num_playerspteam,
        "Number of Players per Teams must be from 2 to 20"
      );
      x++;
    } else {
      setSuccess(check_num_playerspteam);
    }
    if (check_num_playerspteam.value === "") {
      setSuccess(check_num_playerspteam);
    }
  }
  y = x;
}
function setError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = message;
}
function setSuccess(input) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = "";
}
function validate() {
  checkInput();
  if (y == 0) {
    return true;
  }
  return false;
}
const elem = document.getElementById("x");
const ele = document.getElementById("y");
elem.classList.add("is-tab"); // Add class
ele.classList.remove("is-tab");
ele.classList.remove("is-active");
elem.classList.add("is-active");
