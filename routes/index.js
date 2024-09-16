var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/about-us", function (req, res, next) {
  res.render("about-us", { title: "About us" });
});

module.exports = router;
