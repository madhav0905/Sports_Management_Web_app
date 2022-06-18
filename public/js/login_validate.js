let form_pointer = document.getElementById("myform");
let form = document.querySelector("form");

var inputs = document.getElementsByTagName("input");
for (i = 0; i < inputs.length; i++) {
  console.log("inside for");
  inputs[i].onkeyup = checkInput;
}
let y;
function checkInput() {
  var check_username = form_pointer.elements["user_name"];
  var check_password = form_pointer.elements["password"];
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
