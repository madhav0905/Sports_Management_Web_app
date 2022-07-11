const jwt = require("jsonwebtoken");
const axios = require("axios");

const axioskInstance = axios.create({
  withCredentials: true,
  credentials: "include",
});
axios.defaults.withCredentials = true;
module.exports.auth = async function (req, res, next) {
  const t = req.cookies.access_token;

  if (!t) return res.status(403).render("access_denied");
  try {
    const dec = jwt.verify(t, process.env.secret);

    if (dec) {
      if (req.baseUrl === "/admin" && dec.role != "admin") {
        return res.status(403).render("access_denied");
      }
      if (req.baseUrl === "/user" && dec.role != "user") {
        return res.status(403).render("access_denied");
      }

      req.decoded = dec._id;
      req.decoded_role = dec.role;
    }
  } catch (err) {
    console.log(err.name);
    try {
      if (err.name == "TokenExpiredError") {
        const resp = await axioskInstance.post(
          "http://localhost:9009/auth/token",
          {
            cookie: req.cookies.refresh_token,
            url: req.url,
            base: req.baseUrl,
          }
        );
        if (resp) {
          res.cookie("access_token", "", {
            expires: new Date(0),
            domain: "localhost",
            path: "/",
          });
          res.cookie("access_token", resp.data.jwtthing, {
            httpOnly: true,
            secure: true,
          });
          console.log("refreshed");
          const dec = jwt.verify(resp.data.jwtthing, process.env.secret);
          if (dec) {
            if (req.baseUrl === "/admin" && dec.role != "admin") {
              return res.status(403).render("access_denied");
            }
            if (req.baseUrl === "/user" && dec.role != "user") {
              return res.status(403).render("access_denied");
            }

            req.decoded = dec._id;
            req.decoded_role = dec.role;
          }
        }
      } else {
        console.log(err);
        return res.redirect("/");
      }
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }

    //return res.redirect("/");
  }

  next();
};
