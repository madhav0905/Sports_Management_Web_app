const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const t = req.cookies.access_token;

  if (!t) return res.status(401).send("access denied");
  const dec = jwt.verify(t, process.env.secret);

  if (req.baseUrl === "/admin" && dec.role != "admin") {
    return res.status(401).send("Access Denied");
  }
  if (req.baseUrl === "/user" && dec.role != "user") {
    return res.status(401).send("Access Denied");
  }
  console.log(req.baseUrl);
  req.decoded = dec._id;
  req.decoded_role = dec.role;
  next();
};
