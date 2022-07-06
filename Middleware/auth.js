const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const t = req.cookies.access_token;

  if (!t) return res.status(403).render("access_denied");

  try {
    const dec = jwt.verify(t, process.env.secret);
    if (req.baseUrl === "/admin" && dec.role != "admin") {
      return res.status(403).render("access_denied");
    }
    if (req.baseUrl === "/user" && dec.role != "user") {
      return res.status(403).render("access_denied");
    }

    req.decoded = dec._id;
    req.decoded_role = dec.role;
  } catch (err) {
    return res.redirect("/");
  }
  next();
};
