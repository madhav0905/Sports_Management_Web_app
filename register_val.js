function validate() {
  //event.preventDefault();

  let point_to_p = document.getElementById("err_dis");
  let form_pointer = document.getElementById("myform");
  var check_username = form_pointer.elements["user_name"].value;
  var check_password = form_pointer.elements["password"].value;
  var check_name = form_pointer.elements["name"].value;
  var check_address = form_pointer.elements["address"].value;
  var check_age = form_pointer.elements["age"].value;

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

    return false;
  }
  console.log(check_name);
  if (check_name.length > 5 && /^[a-zA-Z ]{5,30}$/.test(check_name)) {
    point_to_p.style.visibility = "hidden";
  } else {
    point_to_p.style.visibility = "visible";
    point_to_p.innerHTML =
      "Name should be atleast 5 letters and should ne only string";
    return false;
  }

  age = parseInt(check_age, 10);

  //check if age is a number or less than or greater than 100
  if (isNaN(age) || age < 1 || age > 100) {
    point_to_p.style.visibility = "visible";
    point_to_p.innerHTML = "Age should be from 10 to 100";
    return false;
  } else {
    point_to_p.style.visibility = "hidden";
  }
  if (
    /^[a-zA-Z0-9 ]{7,100}$/.test(check_address.trim()) &&
    check_address.trim().length > 7
  ) {
    point_to_p.style.visibility = "hidden";
    console.log("entered treue");
  } else {
    point_to_p.style.visibility = "visible";
    point_to_p.innerHTML = "Address should be atleast 7 letters ";
    return false;
  }

  return true;
}
