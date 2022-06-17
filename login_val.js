function validate() {
  console.log("this is from function");
  let point_to_p = document.getElementById("err_dis");
  let form_pointer = document.getElementById("myform");
  var check_username = form_pointer.elements["user_name"].value;
  var check_password = form_pointer.elements["password"].value;
  var check_name = form_pointer.elements["name"].value;
  var check_address = form_pointer.elements["Address"].value;
  var check_age = form_pointer.elements["age"].value;
  console.log(check_username);
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      form_pointer.elements["user_name"].value
    )
  ) {
    point_to_p.style.visibility = "hidden";
  } else {
    point_to_p.style.visibility = "visible";
    point_to_p.innerHTML = "Invalid Email";
    return false;
  }
  var passw = /^[A-Za-z]\w{7,14}$/;
  if (passw.test(check_password)) {
    point_to_p.style.visibility = "hidden";
  } else {
    point_to_p.style.visibility = "visible";
    point_to_p.innerHTML =
      "Password requires at 7 letters and start with alphabets";
  }
  return false;
}
