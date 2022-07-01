let form_pointer = document.getElementById("myform");
let form = document.querySelector("form");

var inputs = document.getElementsByTagName("input");
for (i = 0; i < inputs.length; i++) {
  inputs[i].onkeyup = checkInput;
  inputs[i].onchange = checkInput;
}
let y = -1;
function checkInput() {
  var check_username = form_pointer.elements["user_name"];
  var check_password = form_pointer.elements["password"];
  var check_name = form_pointer.elements["name"];
  var check_address = form_pointer.elements["address"];
  var check_age = form_pointer.elements["age"];
  let x = 0;
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      form_pointer.elements["user_name"].value
    )
  ) {
    setSuccess(check_username);
  } else {
    if (check_username.value != "") {
      setError(check_username, "Email should be valid ");
      x++;
    }
  }
  var passw = /^[A-Za-z]\w{7,14}$/;
  if (passw.test(check_password.value.trim())) {
    setSuccess(check_password);
  } else {
    if (check_password.value != "") {
      setError(
        check_password,
        "Passwords should start with alphabet and atleast contain 7 characters "
      );
      x++;
    }
  }
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
  if (isNaN(age) || age < 1 || age > 100) {
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
