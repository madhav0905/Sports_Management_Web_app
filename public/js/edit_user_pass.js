let form_pointer = document.getElementById("myform");
let form = document.querySelector("form");

var inputs = document.getElementsByTagName("input");
for (i = 0; i < inputs.length; i++) {
  inputs[i].onkeyup = checkInput;
  inputs[i].onchange = checkInput;
}
let y = -1;
function checkInput() {
  let x = 0;
  var check_password = form_pointer.elements["curr_password"];
  var check_pass_1 = form_pointer.elements["new_password1"];
  var check_pass_2 = form_pointer.elements["new_password2"];

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
  if (check_pass_1.value != "" && check_pass_2.value != "") {
    if (
      passw.test(check_pass_1.value.trim()) &&
      passw.test(check_pass_2.value.trim())
    ) {
      if (check_pass_1.value === check_pass_2.value) {
        setSuccess(check_pass_2);
      } else {
        setError(check_pass_2, "2 Passwords are not matching");
        x++;
      }
      if (check_password.value === check_pass_1.value) {
        setError(check_password, "new and old passwords should not be same");
        x++;
      }
    } else {
      if (passw.test(check_pass_1.value.trim())) {
        setSuccess(check_pass_1);
      } else {
        setError(
          check_pass_1,
          "Passwords should start with alphabet and atleast contain 7 characters "
        );
        x++;
      }
      if (passw.test(check_pass_2.value.trim())) {
        setSuccess(check_pass_2);
      } else {
        setError(
          check_pass_2,
          "Passwords should start with alphabet and atleast contain 7 characters "
        );
        x++;
      }
    }
  } else if (check_pass_1.value != "") {
    if (passw.test(check_pass_1.value.trim())) {
      setSuccess(check_pass_1);
    } else {
      setError(
        check_pass_1,
        "Passwords should start with alphabet and atleast contain 7 characters "
      );
      x++;
    }
  } else if (check_pass_2.value != "") {
    if (passw.test(check_pass_2.value.trim())) {
      setSuccess(check_pass_2);
    } else {
      setError(
        check_pass_2,
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
