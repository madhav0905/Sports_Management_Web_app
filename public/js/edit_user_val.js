let form_pointer = document.getElementById("myform");
let form = document.querySelector("form");

var inputs = document.getElementsByTagName("input");
for (i = 0; i < inputs.length; i++) {
  inputs[i].onkeyup = checkInput;
  inputs[i].onchange = checkInput;
}
let name = form_pointer.elements["name"].value;
let address = form_pointer.elements["address"].value;
let ages = form_pointer.elements["age"].value;

let curr_name = form_pointer.elements["name"].value;
let curr_address = form_pointer.elements["address"].value;
let curr_age = form_pointer.elements["age"].value;

let bg = document.getElementById("bg").value;
let curr_blood = bg;
let blood = bg;

if (
  curr_name == name &&
  curr_age == ages &&
  curr_address == address &&
  curr_blood == blood
) {
  document.getElementById("btn").disabled = true;
}
const bld_array = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
for (var i = 0; i < 8; i++) {
  if (bg == bld_array[i]) {
    document.getElementById("blood").options[i].selected = true;
    break;
  }
}
document.getElementById("blood").addEventListener("change", () => {
  curr_blood = document.getElementById("blood").value;
  if (
    curr_name == name &&
    curr_age == ages &&
    curr_address == address &&
    curr_blood == blood
  ) {
    document.getElementById("btn").disabled = true;
  } else if (curr_name == "" || curr_age == "" || curr_address == "") {
    document.getElementById("btn").disabled = true;
  } else {
    document.getElementById("btn").disabled = false;
  }
});
let y = -1;
function checkInput() {
  var check_name = form_pointer.elements["name"];
  var check_address = form_pointer.elements["address"];
  var check_age = form_pointer.elements["age"];
  let x = 0;
  curr_name = form_pointer.elements["name"].value;
  curr_address = form_pointer.elements["address"].value;
  curr_age = form_pointer.elements["age"].value;
  curr_blood = document.getElementById("blood").value;
  if (
    check_name.value.length > 5 &&
    /^[a-zA-Z ]{5,30}$/.test(check_name.value)
  ) {
    setSuccess(check_name);
  } else {
    if (check_name.value != "") {
      setError(
        check_name,
        "Name should be atleast 5 letters and should  only string"
      );
      x++;
    }
  }

  age = parseInt(check_age.value, 10);

  //check if age is a number or less than or greater than 100
  if (isNaN(age) || age < 10 || age > 100) {
    setError(check_age, "Age should be from 10 to 100");
    x++;
  } else {
    setSuccess(check_age);
  }
  if (check_age.value == "") {
    setSuccess(check_age);
  }
  if (
    /^[a-zA-Z0-9 ]{7,100}$/.test(check_address.value.trim()) &&
    check_address.value.trim().length > 7
  ) {
    setSuccess(check_address);
  } else {
    if (check_address.value != "") {
      setError(check_address, "Address should be atleast 7 letters");
      x++;
    }
  }

  if (
    curr_name == name &&
    curr_age == ages &&
    curr_address == address &&
    curr_blood == blood
  ) {
    document.getElementById("btn").disabled = true;
  } else if (curr_name == "" || curr_age == "" || curr_address == "") {
    document.getElementById("btn").disabled = true;
  } else {
    document.getElementById("btn").disabled = false;
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
