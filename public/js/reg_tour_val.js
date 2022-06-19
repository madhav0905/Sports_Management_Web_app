function toggle_in_out() {
  let pointer_select = document.getElementById("select_type");
  let pointer_chooseteam = document.getElementById("chooseteam");
  let pointer_createteam = document.getElementById("createteam");
  let pointer_submit = document.getElementById("submit");
  if (pointer_select.value === "choose") {
    pointer_createteam.style.display = "none";
    pointer_chooseteam.style.display = "block";
    pointer_submit.value = "Register";
    document.getElementById("val_create_name").required = false;
    document.getElementById("val_create_name").value = "sdsa";
    document.getElementById("choose_team").options[0].selected = true;
  } else {
    pointer_createteam.style.display = "block";
    document.getElementById("val_create_name").required = true;
    document.getElementById("val_create_name").value = "";

    document.getElementById("choose_team").required = false;
    document.getElementById("choose_team").value = "";
    pointer_chooseteam.style.display = "none";
    pointer_submit.value = "Create And Register";
  }
}

var options = document.getElementById("choose_team").options;
if (options.length == 0) {
  let pointer_select = document.getElementById("select_type");
  let pointer_chooseteam = document.getElementById("chooseteam");
  let pointer_createteam = document.getElementById("createteam");
  let pointer_submit = document.getElementById("submit");
  pointer_select.options[0].disabled = true;
  pointer_select.options[1].selected = true;
  pointer_createteam.style.display = "block";
  document.getElementById("choose_team").required = false;
  pointer_chooseteam.style.display = "none";
  pointer_submit.value = "Create And Register";
  document.getElementById("noteam").innerText =
    "No teams available Please Create a Team";
}
var inputs = document.getElementsByTagName("input");
for (i = 0; i < inputs.length; i++) {
  inputs[i].onkeyup = checkInput;
  inputs[i].onchange = checkInput;
}
function checkInput() {
  let x = 0;

  if (document.getElementById("select_type").value != "choose") {
    document.getElementById("choose_team").value = "";
    var f = document.getElementById("val_create_name");
    if (f.value.trim().length > 3 && /^[a-zA-Z ]{3,30}$/.test(f.value.trim())) {
      setSuccess(f);
    } else {
      setError(f, "Tournament name should be a valid String");
      x++;
    }
    if (f.value === "") {
      setSuccess(f);
    }
  } else {
    document.getElementById("val_create_name").required = false;

    document.getElementById("val_create_name").value = "";
  }
  y = x;
}
let y;

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
